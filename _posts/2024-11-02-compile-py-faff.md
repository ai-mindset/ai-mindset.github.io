# TIL: Cross-Compiling Python Apps - More Faff Than You'd Think!

Ever tried to share your Python app with mates who don't code? After diving into cross-compilation today, I'm quite happy I took up using Deno for my AI and Data Science needs. In the Deno world, a simple `deno task build` is sufficient to generate executables for all platforms. Meanwhile, in Python:  

## Option 1: PyInstaller with Podman
```bash
# Create container with Python 3.12
podman build -t crosscompile -f- <<EOF
FROM ubuntu:24.04
ENV PYTHONUNBUFFERED=1
RUN apt-get update && apt-get install -y python3.12-venv build-essential
WORKDIR /app
RUN python3.12 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY . .
RUN pip install -e ".[dev]"
EOF
```

# Build
podman run --rm -v .:/app:Z crosscompile pyinstaller --onefile src/yourapp/main.py

## Option 2: BeeWare (with Some Assembly Required)
BeeWare looked promising - native installers (.msi, .dmg, .deb) with proper desktop integration. The catch? You need various native dev libraries (`gtk3-devel` and friends on Linux), and the setup isn't exactly straightforward. Yes, you can automate it with GitHub Actions, but compared to Deno's elegant `deno compile` command, it feels like quite a headache. [Here](https://github.com/ai-mindset/py-cross-compile)'s my attempt at creating and compiling a simple Python desktop app

### Install system deps first
#### Fedora:
`sudo dnf install cairo-devel cairo-gobject-devel gtk3-devel gobject-introspection-devel`
#### Ubuntu:
`sudo apt install libcairo2-dev libgirepository1.0-dev gtk+-3.0-dev python3-dev`

### Then use GitHub Actions for cross-platform builds
```yaml
name: Build
on: [push]
jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
      - run: pip install briefcase
      - run: briefcase create && briefcase build && briefcase package --adhoc-sign
```

## Conclusion
Both approaches work, and at least it's possible to get proper installers now instead of a Python crash course. But Python could learn a thing or two from Deno's simplicity. 


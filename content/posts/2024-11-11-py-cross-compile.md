---
layout: post
title: "🔀 Cross-Platform Builds In Python"
date: 2024-11-11
tags: [
  python,
  github-actions,
  ci-cd,
  cross-platform,
  deno,
  typescript,
  exploration,
  retrospective,
]
---

**TL;DR:** PyInstaller builds an application for the operating system on which
it runs, so releases for Linux, macOS and Windows normally need corresponding
build environments. A CI matrix can automate those native builds. I have since
built [Bundlr](https://github.com/ai-mindset/bundlr), a tool leveraging Deno
that can cross-package supported Python PyPI and git applications for Windows,
macOS and Linux.

<!--more-->

## Introduction

Several people I spoke to needed a bespoke data-analysis tool that could run
locally. A desktop application or command-line interface seemed suitable where
network access, privacy or deployment policy ruled out a hosted service.

[PyInstaller](https://pyinstaller.org/) can package a Python program and
interpreter for users who do not have Python installed. It is not a
cross-compiler: a Windows artefact is built on Windows, and the same principle
applies to macOS and Linux. A Linux developer can use a
[GitHub Actions matrix](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations)
to run the same build on hosted runners for each target.

## Cross-Packaging Python with Bundlr

I have since built [Bundlr](https://github.com/ai-mindset/bundlr) to address
this distribution problem without requiring a Python application to be
rewritten. Given a pinned package from PyPI or an HTTPS Git source, Bundlr can
produce relocatable applications for supported Windows, macOS and Linux targets.
It supports command-line and terminal interfaces as console applications, as
well as graphical applications with windowed launchers.

Bundlr combines a checksum-pinned standalone Python runtime with
target-compatible wheels selected by `uv`. It does not use PyInstaller or run
foreign executables while packaging. The recipient does not need Python, `uv`,
Deno or Bundlr installed. Each target includes an archive, a launcher,
checksums, dependency information, licence notices and build metadata.

This is cross-packaging rather than cross-compiling Python. It works for pure
Python applications and for native dependencies that publish compatible wheels
for every selected target. Bundlr rejects a target when a required wheel is
missing or when a Git dependency would build host-specific native code. The
result still needs testing on every operating system it claims to support.

## Packaging Is Not Portability or Secrecy

A packaged application can still depend on operating-system libraries, CPU
architecture, drivers and files that the packaging tool did not detect. Each
artefact therefore needs a smoke test on its destination platform. Signing,
notarisation and antivirus false positives may also affect distribution.

Packaging source code with a runtime does not provide strong
intellectual-property protection. Python bytecode and embedded JavaScript can be
inspected. If an algorithm must remain secret, architectural and legal controls
are more credible than assuming an executable is opaque.

## The Alternatives I Explored

- **Julia:** [PackageCompiler](https://julialang.github.io/PackageCompiler.jl)
  can create applications and libraries, while
  [BinaryBuilder](https://binarybuilder.org/) supports binary dependencies.
  Julia's interactive numerical environment appealed to me, but its
  application-distribution workflow did not simplify this particular problem
  enough.
- **Elixir:** [Burrito](https://hex.pm/packages/burrito) packages an Elixir
  release with an Erlang runtime. It was an interesting option, especially
  alongside the Nx ecosystem, but adopting a new runtime solely for packaging
  would have been a large trade.
- **Deno:**
  [`deno compile`](https://docs.deno.com/runtime/reference/cli/compile/)
  packages a TypeScript or JavaScript program and a slimmed-down runtime into
  one executable. Its `--target` option can cross-compile for the supported
  operating systems and architectures from one host.

## Decision Rule

For an existing Python CLI, TUI or GUI application, Bundlr is worth trying when
its dependencies are pure Python or provide wheels for every target. A native CI
build remains the more dependable route for host-specific extensions, drivers or
operating-system integrations. If the program is small, distribution is central
to its value and TypeScript libraries cover the work, Deno's direct
cross-compilation can still be attractive. In every case, build and test each
advertised target and document what remains external to the application.

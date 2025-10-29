---
layout: post
title: "🔀 Cross-Platform Builds In Python"
date: 2024-11-11
tags: [python, github-actions, ci-cd, cross-platform, deno, typescript]
---

**TL;DR:** Creating cross-platform Python application packages requires CI/CD solutions like GitHub Actions since tools like PyInstaller can't natively build for multiple platforms; alternatives like Julia and Elixir offer promising but still-maturing packaging options, while Deno emerges as an appealing alternative with its straightforward cross-platform packaging capabilities, lightweight footprint, and growing data ecosystem- though Python remains dominant for data analysis despite its packaging limitations.
<!--more-->

## Introduction

In the last couple of years I've spoken to 3-4 people who had needed a bespoke data analysis tool that could be used locally, with privacy in mind. In some cases they'd need to work in a sandboxed environment for security reasons, other times they had IP protection concerns. A desktop app or a CLI tool[^1] seemed to fit the bill in all those cases.\ In the last decade+, Data and Python have become a synonym. [PyInstaller](https://pyinstaller.org/) seemed like an obvious choice. However, PyInstaller cannot cross-compile code as it stands. Being a _Linux_ user, offering to help _Windows_ users, meant I should find a workaround e.g. leveraging GitHub Actions for cross-compilation.

## Taking The Scenic Route

Out of curiosity, I decided to have a poke around a couple of different languages and ecosystems that could teach me a few things while helping me understand what is a viable alternative to Python.

### Julia

The [Julia](https://julialang.org/) programming language has caught my eye since 2014. It partially reminded me of MATLAB, that I used for my PhD. Familiarity aside, it's a great language to develop with. It's fast, interactive, with the best REPL I've encountered, highly promising overall especially so after the release of Julia v1.9.\ To my understanding Julia, being a JIT compiled language, wasn't designed for static compilation per se. Community efforts have enabled the generation of compiled packages, with [BinaryBuilder](https://binarybuilder.org/), [PackageCompiler](https://julialang.github.io/PackageCompiler.jl) and [StaticCompiler](https://github.com/tshort/StaticCompiler.jl) being the most well known compilation tools available at the time of writing. From an intermediate Julia user's point of view, I've found that compilation results may vary. Also, to the best of my knowledge most compilation tools actually _package_ code rather than statically compile it, which may expose valuable IP. Therefore, I concluded that Julia _probably_ isn't as easy to compile as I initially thought (and hoped).

### Elixir

[Elixir](https://elixir-lang.org/) is a fantastic hosted functional language, running on the tried and tested [BEAM (Erlang VM)](https://en.wikipedia.org/wiki/BEAM_(Erlang_virtual_machine)). One of the many things Elixir has going for it, is its strong drive towards _good_ documentation. The language's REPL is also excellent. All in all, Elixir is rapidly evolving and it's worth experimenting with.\ Starting from 2021, [Numerical Elixir (Nx)](https://github.com/elixir-nx) has progressed by leaps and bounds. The Nx community has managed to produce excellent libraries, with [Livebook](https://livebook.dev/) being the best literate programming environment I've ever used. As far as data applications are concerned, Elixir will become a _very strong_ contender, it's well worth keeping a close eye on the language.\ As for cross-compilation, to my understanding [Burrito](https://hex.pm/packages/burrito) is the only tool that allows for packaged Elixir code to be truly portable albeit producing sizeable executables. Burrito is still WIP, not a guaranteed solution for the time being but a noteworthy tool that's improving fast.\ Being doubtful as to whether this tech stack could meet all my current needs, beside being a niche language in Data and AI, led me to search for another tech stack for fun and profit.

### Deno (TypeScript)

<<<<<<< HEAD
## What About Python Cross-Compilation?

**How hard could it be?** 🤔\

More recently, especially given many AI Engineering APIs are written both in Python _and_ TypeScript, I started using Deno. The idea is to leverage Deno for all my computational needs, since it's an all-in-one, straightforward to use runtime. Installation and setup were a breeze, Deno comes with _all_ the tools a developer requires (formatter, linter, testing suite, package manager etc.), it plays very nicely with Vim, it's lightweight, secure, compatible with NPM packages and the list goes on. Importantly, it can easily cross-compile executables. The data and AI ecosystem is not yet as mature as that of Python. However, if someone is willing to put in the effort, I've found that it's well worth the investment. This is why I am betting on Deno for my Data Science and AI needs.

I wrote two pipelines, one for generating a [Unix build](https://github.com/ai-mindset/py-cross-compile/blob/main/.github/workflows/unix-build.yml) and one for [Windows](https://github.com/ai-mindset/py-cross-compile/blob/main/.github/workflows/win-build.yml). The result is pretty decent, however the cumbersome process and reliance on third party tech (GitHub Actions in this case) strengthened my conviction that Deno and TypeScript are worth investing in, for a more complete solution. The JS/DS Data[^2] ecosystem is not as mature yet but it's evolving pretty fast.

## Conclusion

The process of cross-compiling a simple Python app was pretty instructive. The main downside I see is the reliance on a hosting service and a CI/CD platform. Frankly, having access to a hosting service and using CI/CD is almost a given in my line of work. Still, it's nowhere near as straightforward as running `$ deno compile main.ts` I am considering attempting the same using [Podman](https://podman.io/), since [Windows](https://learn.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/container-base-images), [macOS](https://github.com/sickcodes/Docker-OSX) and [Linux](https://hub.docker.com/_/ubuntu/) containers are available. Stay tuned for updates!

---

[^1]: One might argue that running statically compiled executables in a
    sandboxed environment is a security risk. Static malware analysis tools
    exist for this exact reason

[^2]: To be fair, the Data ecosystem is pretty decent and continuously
    improving. It's the ML and statistical ecosystem and specifically the lack
    of a native Scikit-learn and Scipy-like packages that's still somewhat
    lacking

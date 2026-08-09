---
layout: post
title: "📦 From Compilation to Containerisation and Back Again"
date: 2025-03-19
tags: [
  deno,
  typescript,
  deployment,
  cross-platform,
  evolution,
  toolchain,
  best-practices,
  code-quality,
]
---

**TL;DR:** `deno compile` packages TypeScript or JavaScript, its dependencies
and a slimmed-down Deno runtime into a target-specific executable. That can
simplify distribution for command-line tools and some services, although the
result is not native compilation in the C or Rust sense and does not eliminate
platform testing, external services or operational dependencies.

<!--more-->

## Introduction

Over the years, I've experimented with numerous programming languages and
deployment strategies. Python has been my domain's lingua franca - with its vast
ecosystem for data science and AI applications. However, its deployment
complexities have consistently been a pain point: managing dependencies,
configuring containers, and setting up build pipelines.\
This search led me through ahead-of-time compiled languages such as Go and Rust,
JIT-compiled Julia, and JVM or BEAM languages. Deno became a compelling option
for my work because it can package TypeScript and JavaScript programs as
standalone executables.

## The Circular Evolution of Programming Languages

Compiled, interpreted and virtual-machine-based languages have coexisted for
decades. Fortran and COBOL date to the 1950s, while C emerged in the early
1970s; Python and the JVM did not replace them. Each execution and distribution
model optimises a different mix of portability, startup, performance and
developer experience.

Python applications can require dependency, environment and platform management.
Containers address some environment differences by distributing a filesystem and
runtime together, but add image, networking and operational concerns. A
standalone executable is another packaging option, not the final stage of a
linear evolution.

## Deno: Compilation Makes a Comeback

As highlighted in the
[Run JavaScript Anywhere](https://www.youtube.com/watch?v=ZsDqTQs3_G0) video,
Deno's [`compile` command](https://docs.deno.com/runtime/reference/cli/compile/)
packages a JS or TS program into a standalone executable for a supported
operating-system and processor target. The destination does not need a separate
Deno installation.

```typescript
// sample.ts
import open from "npm:open";

// Open a URL in the default browser
await open("https://example.com");
```

With `deno compile sample.ts`, this code becomes an executable for the current
target. Cross-compilation requires an explicit `--target`, and each output still
needs testing on that platform. The command embeds the program and its included
dependencies in `denort`, a slimmed-down Deno runtime. Native addons, dynamic
imports and data files can require extra handling, so "standalone" should not be
confused with "compatible with every program without configuration".

The key benefits include:

1. **Cross-platform compatibility** without runtime requirements
2. **Simplified deployment** with single-binary distribution
3. **Bundled assets** for complete portability
4. **A predictable artefact** that can be distributed without a separate Deno
   installation

Deno also supports npm dependencies, cross-compilation, included assets and
platform code-signing workflows. The exact feature set changes with Deno
releases, so the official command reference is more reliable than this dated
snapshot.

## The Single Language Advantage

Beyond deployment simplicity, using one language across more of a project can
reduce some context switching. I have also seen language boundaries create team
silos. Neither outcome is automatic: a monolingual stack can still have
incompatible frameworks, while a well-designed polyglot system can have clear
ownership and interfaces.
[Amplified's case study](https://dockyard.com/blog/2024/02/06/5-benefts-amplified-saw-switching-to-elixir)
demonstrates this point clearly. After switching from a React/JS front-end and
Phoenix/Elixir back-end to an all-Elixir approach with LiveView, they reported:

1. **Halved server costs** through more efficient resource utilisation
2. **Increased development speed** by eliminating cross-language silos
3. **Improved team cohesion** with shared tooling and knowledge
4. **Enhanced maintainability** through code reuse
5. **A smaller team supporting the resulting application**, according to the
   case study

TS with Deno provides a single-language opportunity for front-end interfaces,
back-end services and some data-processing workflows, as I discuss in
[Modern Data Science and AI Engineering with Deno 2.0](/posts/deno.html). For my
work, sharing syntax, types and test tools reduces cognitive load. Library
coverage and numerical performance still need to be assessed task by task.

## Practical Applications

Deno's compilation capabilities shine in several real-world scenarios:

1. **CLI tools**: Create self-contained executables for supported target
   platforms.
2. **Offline environments**: Bundle dependencies and assets when runtime package
   resolution is unavailable.
3. **Cross-platform utilities**: Reuse TypeScript and web-platform APIs without
   requiring a browser.

## Conclusion

Deno has not brought programming-language history full circle; it has made an
old and useful distribution property available to a modern web-platform
language. For my AI engineering work, that can remove a separate runtime
installation and reduce packaging friction while retaining the TypeScript
ecosystem.

The practical test is the artefact, not the metaphor: compile for each supported
target, run integration tests there, inspect binary size and startup, verify
assets and native dependencies, and document the permissions embedded at compile
time. Where those checks pass, a single executable is pleasantly simple.

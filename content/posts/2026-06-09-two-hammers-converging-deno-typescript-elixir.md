---
layout: post
title: "🔨 Two Hammers: Converging on 🦕 Deno with TypeScript and 💧 Elixir"
date: 2026-06-09
tags: [
  deno,
  typescript,
  elixir,
  beam,
  language-design,
  toolchain,
  polyglot,
  ai,
  data-science,
  concurrency,
  fault-tolerance,
  minimalism,
]
---

**TL;DR:** Deno with TypeScript is my default for scripts, command-line tools,
services, browser code and most AI integration work. I use Elixir when
supervision, back-pressure and large numbers of independent, long-lived
processes are central to the problem. Between them, they cover most of the
software I build. Each project gets the one that suits its shape.

**Edit: September 2026 - I substantially revised this article after more
project work. Deno with TypeScript remains my default. I reach for Elixir when
the BEAM's operational model saves enough complexity to justify another
language boundary.**

<!--more-->

## Introduction

The search for _one language to rule them all_ is a rabbit hole.
The appeal is obvious -to me: a single mental model, one toolchain, one community.
I have explored the question seriously, from
[Deno's integrated TypeScript workflow](/posts/deno.html) and
[Go's refreshing minimalism](/posts/go-pragmatic-modern-development.html) to
[Rust's memory-safety guarantees](/posts/transitioning-from-python-to-rust-for-ai.html)
and
[the broader return of compiled languages](/posts/compilation-going-back-full-circle.html).

Project work eventually changed the question. The current versions of
[`bundlr`](https://github.com/ai-mindset/bundlr) and
[`synthesis`](https://github.com/The-Strategy-Unit/synthesis) are built with
Deno and TypeScript. Synthesis is a local-first, single-user application, which
made Deno the better fit. Its earlier Elixir implementation also gave me
practical experience of the BEAM and showed me where that runtime earns its
place.

That is why I keep both. Deno with TypeScript covers most of my work. Elixir
earns its place when a system depends on supervision, back-pressure and large
numbers of long-lived concurrent processes.

## The Journey So Far

**Deno** first appealed to me because it could run TypeScript directly, package
small tools and apply explicit permissions to filesystem, network, environment
and subprocess access. Building real projects settled the trade-off for me.
Access to browser APIs, TypeScript and npm has saved more work than JavaScript's
quirks and npm's toolchain complexity have created.

**Go** still offers an unusually small language, fast builds and predictable
operations. It is an excellent answer when straightforward native services are
the target. My own work usually calls for TypeScript's reach into the browser
ecosystem or the BEAM's process and supervision semantics, which puts Go
between the two strengths I use most.

**Rust** makes the strongest case for native performance and compile-time
memory safety. I choose it at boundaries where those properties justify the
ownership model. Most of my applications run well on a managed runtime, so I
prefer to spend that complexity elsewhere.

**Elixir** is different because the language and the runtime encourage a
different architecture. Lightweight processes communicate through messages;
supervisors describe how failures are contained and recovered; OTP makes
lifecycle and introspection part of the system itself. This architecture earns
its place in programs built around concurrency, long-lived state and routine
partial failure. OTP provides one coherent model for all three.

## Hammer One: Deno with TypeScript

Deno is my default because it shortens the path from an idea to an operable
program and gives me access to a broad ecosystem.

### One Toolchain, Gradually Applied

[TypeScript is a first-class language in Deno](https://docs.deno.com/runtime/fundamentals/typescript/).
A small `.ts` file runs directly, and the same executable provides type
checking, formatting, linting, testing, benchmarking and documentation tools.
That keeps setup small. A script and a service can share the same commands and
conventions as they grow.

Deno treats execution and type checking as separate steps. Running a
TypeScript file strips its types and starts the program; I run `deno check`,
use editor diagnostics and add a CI check to catch type errors. Interfaces
exist only during development, so I validate HTTP responses and configuration
files as they enter the program and test those boundaries.

### Reach Across Existing Ecosystems

Deno supports web-standard APIs, JSR packages and
[most Node and npm workflows](https://docs.deno.com/runtime/fundamentals/node/).
That makes incremental adoption realistic: existing packages can fill gaps,
while new code can use ES modules and Deno's built-in tools. TypeScript can also
describe shared contracts across a browser interface, an API and a command-line
client. That saves schema translation at internal boundaries.

npm support has limits. Some packages assume Node's exact filesystem layout or
APIs, and native add-ons need local `node_modules` plus FFI permission. I test
those cases on the deployment target. Compatibility opens the ecosystem;
individual packages still need verification.

### Explicit Capabilities and Practical Distribution

Deno's
[permission model](https://docs.deno.com/runtime/fundamentals/security/) denies
most system I/O until it is granted and lets permissions be scoped to particular
paths, hosts or environment variables. This makes a program's expected powers
visible in its launch command or configuration. It is a useful least-privilege
mechanism. I treat FFI code and broad subprocess access as separate security
concerns because they can bypass or undermine those permissions.

For distribution,
[`deno compile`](https://docs.deno.com/runtime/reference/cli/compile/) can embed
the application and runtime in a self-contained executable and cross-compile
for supported targets. That has been valuable for tools such as Bundlr. The
user gets one executable with the Deno runtime included. It is larger than a
small native binary, and native dependencies or dynamically loaded assets can
complicate packaging.

### A Good Fit for Applied AI and Data Work

Most of my AI engineering consists of moving data, calling model or embedding
services, validating structured output, building review interfaces and running
repeatable pipelines. TypeScript's web ecosystem and Deno's toolchain cover
that application-shaped work well. The current Synthesis codebase is useful
evidence: ingestion, local storage, search, provider boundaries and a browser
UI all live in one language, with deployment kept as a separate decision.

Python remains the sensible choice for specialist statistical methods,
research implementations and GPU training. The actual workload and available
libraries decide it for me.

## Hammer Two: Elixir

Elixir earns its place by making failure and concurrency first-class design
material.

### Concurrency With Isolation

[Elixir processes](https://hexdocs.pm/elixir/processes.html) are isolated,
communicate through messages and underpin distributed and fault-tolerant
programs on the BEAM. Each process has its own heap, so one job, connection or
piece of state can fail in isolation. Races and overload appear as interactions
between process boundaries, which gives those problems a more explicit shape.

The important unit is the supervision tree.
[Supervisors](https://hexdocs.pm/elixir/Supervisor.html) encode how child
processes start, stop and restart, including which failures should affect which
siblings. A supervision tree keeps recovery policy in one inspectable
structure, replacing scattered `try` blocks and retry loops. That is
particularly valuable for always-on systems where partial failure is routine.

### Back-Pressure and Workflows

[Broadway](https://hexdocs.pm/broadway/introduction.html) adds demand-driven
back-pressure, batching, acknowledgements, rate limiting and failure handling
to the runtime. These controls keep fast producers and slow consumers in
balance. They address the concerns that accumulate around queues, event streams
and AI jobs once a prototype becomes a service.

OTP and Broadway are practical tools for systems that coordinate many
independent jobs, retain per-job state, stream progress, limit external API
pressure and recover individual failures. Together they can replace a
substantial amount of bespoke orchestration.

### Numerical Work and Model Serving

[Nx](https://hexdocs.pm/nx/Nx.html) provides tensors, numerical definitions and
compiler-backed CPU or GPU execution, while
[Nx.Serving](https://hexdocs.pm/nx/Nx.Serving.html) packages preprocessing,
batching, partitioning and model execution behind a serving abstraction. That
combination is compelling when inference must live inside a concurrent Elixir
system.

Python offers a broader data-science ecosystem, and an external model service
is often the simplest option. I choose Elixir here for the coordination and
reliability around the computation.

Deployment is also different. `mix release` creates a
[self-contained release](https://hexdocs.pm/mix/Mix.Tasks.Release.html) with the
application, its dependencies and the Erlang runtime. The artifact must be
built for a compatible target. It provides a production-grade release model;
`deno compile` provides greater cross-compilation convenience.

## The Tradeoffs

|                       | Deno with TypeScript                       | Elixir                                        |
| --------------------- | ------------------------------------------ | --------------------------------------------- |
| Default role          | Scripts, CLIs, services and browser code   | Concurrent, stateful, always-on systems       |
| Type model            | Static checks, erased at runtime           | Dynamic, with pattern matching and guards     |
| Concurrency           | Async I/O, workers and library primitives  | Isolated BEAM processes and message passing   |
| Failure handling      | Exceptions, results and explicit retries   | Links, monitors and supervision trees         |
| Ecosystem reach       | Web APIs, JSR, Node and npm                | Erlang/OTP, Hex and Phoenix                   |
| AI and data           | Broad integration ecosystem                | Nx plus strong serving orchestration          |
| Distribution artifact | Cross-target self-contained executable     | Target-specific self-contained release        |
| Main caveat           | Runtime validation and JS semantics remain | Dynamic types and a smaller general ecosystem |

In practice, Deno carries most of the work. Elixir covers supervision and
process orchestration at the runtime level.

## A Practical Selection Rule

I would start with Deno when the program is primarily a script, local tool,
HTTP service, browser-backed application or integration pipeline. Its types,
tooling and ecosystem keep the feedback loop short, and its deployment options
are sufficient for most of those cases.

I would choose Elixir when at least one of these is central to the design:

- Thousands of independent, long-lived activities must be coordinated.
- Individual failures should be isolated and recovered under explicit policy.
- Back-pressure, batching and queue acknowledgement are core domain concerns.
- Stateful real-time connections or distributed process communication dominate.
- Operating and inspecting the live system matters more than sharing browser
  code.

When a system uses both, I keep the language boundary coarse and explicit, such
as an HTTP or event interface. The boundary earns its place when the BEAM
removes more operational complexity than the extra service creates.

## Conclusion

After trying these languages in real projects, my rule is simple. Deno with
TypeScript comes first because it offers a compact toolchain, broad reach,
useful static checks and pragmatic distribution. I pick up Elixir when the job
is coordinating many fallible things over time.

So the two hammers stay. Deno gets used most days. Elixir waits for the jobs
that need the BEAM.

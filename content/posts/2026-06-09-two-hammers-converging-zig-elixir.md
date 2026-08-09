---
layout: post
title: "🔨 Two Hammers: Converging on ⚡ Zig and 💧 Elixir"
date: 2026-06-09
tags: [
  zig,
  elixir,
  gleam,
  language-design,
  toolchain,
  polyglot,
  ai,
  data-science,
  minimalism,
  exploration,
  retrospective,
]
---

**TL;DR:** In June 2026, I thought Zig and Elixir might cover my systems and
application needs together. Building small projects exposed useful strengths in
each language, but "nearly everything" was premature. The August edit records
the outcome of the experiment: I ultimately chose Deno with TypeScript as my
single-language setup.

**Edit: August 2026 - This article describes an earlier stage of language
experimentation. Trialing Go, Rust, Zig and Elixir led me to settle on Deno with
TypeScript as my monolingual setup for AI Engineering and Data Science as I move
away from Python.**

<!--more-->

## Introduction

The search for _one language to rule them all_ is a rabbit hole I knowingly fell
into - a time pit, as much as anything else, of experimentation, learning, and
hard-won dead ends. The appeal is obvious: one mental model, one toolchain, one
community. I've explored this question seriously - from
[Deno's zero-config TypeScript](/posts/deno.html) and
[Go's refreshing minimalism](/posts/go-pragmatic-modern-development.html) to
[Rust's memory safety guarantees](/posts/transitioning-from-python-to-rust-for-ai.html)
and also
[the broader question of compiled languages making a comeback](/posts/compilation-going-back-full-circle.html).

Now, after building [`bundlr`](https://github.com/ai-mindset/bundlr) in Zig and
[`synthesis`](https://github.com/The-Strategy-Unit/synthesis) in Elixir, and
after stumbling across
[Andrew Kelley's 2026 interview](https://www.youtube.com/watch?v=iqddnwKF8HQ)
recently, I feel that I'm closing in on the answer I've been looking for.

## The Journey So Far

**Deno** was compelling for its zero-config TypeScript, single-binary
deployment, and security model. But JavaScript's warts never quite disappeared,
and the ecosystem - despite being rich - carried Node.js's baggage.

**Go** offered something rarer: a sub-50-page language spec, prescriptive
tooling, and a single way to solve most problems. For production AI and data
work it was genuinely appealing. But its ceiling - no BEAM, no low-level
control, a maturing but still thin ML ecosystem - hasn't been as appealing.

**Rust** addressed the performance and safety arguments convincingly, with
libraries like [Rig](https://rig.rs/), [Polars](https://docs.pola.rs/), and
[ndarray](https://docs.rs/ndarray/) covering most of an AI engineer's needs. Yet
its borrow checker imposes a steep ongoing cognitive tax that doesn't align with
my preference for simplicity.

In parallel, I've settled on a
[minimal AI toolstack](/posts/finding-balance-my-current-ai-development-toolstack.html)
that values control over automation. The same instinct is now shaping my
language choices.

## Zig

Vibe-ish building [`bundlr`](https://github.com/ai-mindset/bundlr) - admittedly
shoddy Zig - gave me a taste of the language. What stood out:

- **Cross-compilation as a first-class concern.** Zig supports many targets from
  one toolchain, although dependencies and operating-system interfaces can still
  complicate a build.
- **Explicit is genuinely better than implicit.** Error handling, allocators,
  `comptime` - all force clarity that pays dividends later.
- **Explicit control flow and allocation.** The source remains subject to
  compiler optimisation and hardware behaviour, but fewer implicit runtime
  mechanisms can make costs easier to inspect.
- **Owning more of the stack.** Kelley's work on Zig's self-hosted compiler
  demonstrates the potential benefits and substantial engineering cost of
  controlling core tooling. Performance figures from a project presentation
  should be verified on the relevant codebase and hardware.

The caveat: Zig's AI/ML/Data Science ecosystem is still nascent. Practical data
science in Zig today means writing many of your own bindings or leaning on C
FFI - though notably, at least one of Zig's major sponsors operates in the AI/ML
space, signalling real industry momentum. It's a significant investment, but one
that compounds over time.

## Elixir (and Gleam)

[`synthesis`](https://github.com/The-Strategy-Unit/synthesis) is built in Elixir
because Elixir was simply the right tool: BEAM's concurrency and fault-tolerance
model is unmatched for that class of problem.
[Project Nx](https://github.com/elixir-nx/nx),
[Bumblebee](https://github.com/elixir-nx/bumblebee),
[Scholar](https://github.com/elixir-nx/scholar), and
[Dux](https://github.com/elixir-dux/dux) are evolving fast, and the AI/ML story
is becoming genuinely compelling.

Ideally I'd have liked to use [Gleam](https://gleam.run) instead - Elixir's
younger sibling. It runs on BEAM, brings a strong static type system, and ships
batteries-included (formatter, linter, package manager, LSP). The gap is
deployment and native ecosystem: Elixir's
[Burrito](https://github.com/burrito-elixir/burrito) has no Gleam equivalent
yet - something
[I noted as a caveat as far back as 2025](/posts/compilation-going-back-full-circle.html).

## The Tradeoffs

|                       | Zig                      | Elixir / Gleam                   |
| --------------------- | ------------------------ | -------------------------------- |
| AI/ML ecosystem       | Sparse (C FFI available) | Rapidly growing (Nx)             |
| Learning curve        | Steep                    | Moderate                         |
| Cross-compilation     | Excellent (built-in)     | Limited                          |
| Concurrency model     | Manual                   | BEAM (world-class)               |
| Deployment            | Single binary            | Burrito (Elixir only)            |
| Control / performance | Maximum                  | Good, not systems-level          |
| Type system           | Comptime-based           | Static (Gleam), dynamic (Elixir) |

## A Conclusion (Almost)

I'm not ready to declare victory yet. But the question is no longer _which
language_ - it's _whether one of these two[^1] can stretch far enough to replace
the other_ for my use cases.

Zig's AI/ML story needs to mature before it can replace Python for data work.
Elixir/Gleam's deployment story needs to close the gap with single-binary
distribution. Both ecosystems are moving. The answer may simply be: use both,
deliberately, and resist the urge to collapse them into one.

Sometimes two good hammers beat one imperfect universal tool.

---

[^1]: Gleam can call Erlang and Elixir modules through its external-function
    mechanism. That interoperability is distinct from NIFs, which run native
    code inside the BEAM virtual machine and carry additional safety
    considerations. I could have written Synthesis in Gleam while calling Elixir
    libraries, but relying heavily on another language's APIs would have
    weakened my reason for choosing it.

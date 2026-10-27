---
layout: post
title: "🔨 Two Hammers Revisited: From Deno and Elixir to Go"
date: 2026-06-09
tags:
  [
    deno,
    go,
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

**TL;DR:** In June 2026 I hesitantly chose two hammers: Deno with TypeScript
for applications and Elixir for supervised concurrency. Python remained useful
as glue and for specialist methods. In October, Deno announced one more year of
company-led runtime maintenance before ending its development. Bun's compiled
executables were too large for my needs; Deno with QuickJS remains my preferred
way to package a small TypeScript tool, but its engine is experimental. Go's
small language, integrated tools and useful AI/data packages now cover enough
of my work to make it my default for new projects.

**October 2026 update:** This revises my June choice. Existing Deno projects
still deserve their own migration decision.

<!--more-->

## Why I Kept Two Hammers

I wanted one primary language for application work, with Python available for
glue and specialist libraries. [Deno's TypeScript
workflow](https://docs.deno.com/runtime/fundamentals/typescript/) suited web
interfaces, integrations and command-line tools. [Elixir's
supervisors](https://hexdocs.pm/elixir/Supervisor.html) made it a better fit for
systems whose processes must recover from routine failures. Neither covered
both sets of needs as well as I wanted, so I kept both reluctantly. Work on
[Bundlr](https://github.com/ai-mindset/bundlr) and
[Synthesis](https://github.com/The-Strategy-Unit/synthesis) made Deno's
strengths concrete in a packaging tool and a local-first application.

## What Changed

On 9 October 2026, [Deno announced that its team was joining
Cloudflare](https://deno.com/blog/cloudflare). It promised monthly runtime
releases with bug fixes and security updates for another year, then said it
would end its own development of the runtime. Deno will remain open source and
community development may continue. For me, relying on an uncertain handover
makes Deno a risky default for new projects.

I tried Bun briefly as another TypeScript runtime. Its compiled executables
were too large for my distribution needs. [Bun's documentation](https://bun.sh/docs/bundler/executables)
explains that each executable includes the Bun runtime and acknowledges its
binary size. That rules Bun out as my replacement for Deno in small tools.
Deno's [`--engine quickjs`
option](https://docs.deno.com/runtime/reference/cli/compile/#choosing-a-javascript-engine)
produces smaller Deno executables and feels better suited to my small tools.
That option is experimental, runs compute-heavy code more slowly than V8 and
does not receive the same security updates; Deno advises against using it for
untrusted input. QuickJS improves packaging, but it does not change Deno's
announced maintenance horizon.

## Why Go Became the Default

Go gives me a small language and a [standard toolchain](https://go.dev/doc/cmd)
for formatting, testing, static checks and builds. Rewriting this site's
builder in Go gave me a concrete trial: the standard library covers files,
templates and HTTP, while Goldmark handles Markdown. That is evidence from a
small project, not a claim that Go fits every workload.

For application-focused AI engineering, Go's standard library handles HTTP and
JSON. I can add [DuckDB](https://duckdb.org/docs/current/clients/go/overview.html)
for local analytical SQL, [Golars](https://github.com/Gaurav-Gosain/golars)
for dataframes, [go-echarts](https://github.com/go-echarts/go-echarts) for
interactive reports or [GoMLX](https://gomlx.github.io/) for model computation
when a project needs them. These are optional libraries with different maturity
and deployment costs, as discussed in my [Go
article](/posts/go-pragmatic-modern-development.html). Together they make Go
worth trying as my primary language without putting every capability in every
project.

## A Practical Selection Rule

I now start new services, command-line tools and AI/data integrations in Go.
I choose Elixir when supervision is central, and use Python when a specialist
method or training library warrants it. The aim is one simple starting point,
with exceptions based on the job rather than a promise that one language does
everything.

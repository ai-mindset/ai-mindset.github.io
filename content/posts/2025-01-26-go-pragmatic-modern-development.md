---
layout: post
title: "🚀 A Minimal, Pragmatic Approach to Production-Ready AI & ML with Go"
date: 2025-01-26
tags:
  [
    ai,
    go,
    llm,
    minimal,
    machine-learning,
    toolchain,
    zero-config,
    code-quality,
    cross-platform,
    production,
    exploration,
    retrospective,
  ]
---

**TL;DR:** Go's small language and excellent built-in tools always appealed to
me, but I doubted it could cover enough of my AI and data work to be my primary
language. Deno's move to Cloudflare prompted another look. With focused options
for local SQL, dataframes, charts and model computation, Go now covers enough
of my workflow to be worth trying again as my default.

**Update, October 2026:** This article began as a January 2025 experiment. I
chose Deno with TypeScript after comparing Go, Rust, Zig and Elixir. After
[Deno's move to Cloudflare](https://deno.com/blog/cloudflare), I revisited Go's
tooling and made it my default for new work. The new section below describes
the current stack; the library comparison below reflects what I would use now.

<!--more-->

## October 2026: A Small Go Stack for AI Engineering

Go's standard tools already cover compilation, formatting, tests and ordinary
HTTP and JSON integration. For many AI applications, that is enough to call a
model service, validate its response and expose a small interface. When the
work needs local analysis, dataframes, charts or model execution, I can add one
focused package:

- **Analytical SQL:** The [DuckDB Go client](https://duckdb.org/docs/current/clients/go/overview.html)
  implements Go's `database/sql` interface and embeds DuckDB for local queries.
  It also exposes Arrow and bulk-loading APIs. DuckDB's C++ engine means the Go
  client uses cgo and needs a C compiler to build; prebuilt libraries avoid a
  separate DuckDB installation on supported platforms.
- **Dataframes:** [Golars](https://github.com/Gaurav-Gosain/golars) is an
  independent, pure-Go project modelled on Polars. It uses Apache Arrow and
  offers eager and lazy operations plus CSV and Parquet workflows. Its API and
  performance claims deserve testing against my own data before I depend on
  them in production.
- **Visualisation:** [go-echarts](https://github.com/go-echarts/go-echarts)
  generates interactive chart pages from Go. It builds on Apache ECharts, so
  the rendered charts still use JavaScript in the browser. I would use it for
  interactive reports, not as evidence that Go alone renders every chart.
- **Model computation:** [GoMLX](https://gomlx.github.io/) provides a Go API
  for machine-learning computation and models. Its pure-Go backend keeps simple
  deployment possible; the faster XLA path can use CPU, GPU or TPU but brings
  cgo and accelerator dependencies. I would choose the backend after measuring
  the actual workload.

Together, these tools make Go a credible centre for much of my
application-focused AI engineering. "Batteries included" describes the
workflow I can assemble, not Go's standard library. A small service may need
none of these packages; a data-heavy program may need DuckDB or Golars; model
research can still justify Python. The goal is fewer moving parts for each
project, not every capability in every binary.

## Introduction

Modern software development often involves navigating complex toolchains,
opinionated frameworks, and resource-heavy development environments. Many
languages require extensive configuration, multiple runtime dependencies, and
introduce significant cognitive overhead through their vast feature sets and
multiple approaches to solving the same problem. Node.js, JVM languages, and
even Python with its extensive ecosystem can lead to analysis paralysis, code
inhomogeneity and team disagreements over tooling and style.\
Go offers a compact language and a consolidated toolchain. Built-in formatting
(`go fmt`), static analysis[^1] (`go vet`) and testing tools provide strong
shared defaults that can reduce style debates. "Zero configuration" is too
literal: modules, build constraints, linters and deployment still require
decisions, while the community spans many forums rather than one central
channel. Go lacks a REPL as sophisticated as IPython or Julia's interactive
environment. That trade-off encouraged me to rely more on small tests and
executable examples. Tools like [vim-go](https://github.com/fatih/vim-go)'s
`:GoRun` and the Go Playground still provide a useful feedback loop.\
Below I'm collecting some thoughts on attractive aspects of Go I've discerned so
far and how they compare with other languages I've considered. The list of Go's
features is far from complete, for example I've not mentioned goroutines among
others.

## Python vs Go Libraries Comparison

These are choices for particular tasks, not promises of Python API parity:

| Task | Python reference | Go choice and limit |
| --- | --- | --- |
| Numerical methods | [NumPy](https://github.com/numpy/numpy) | [Gonum](https://github.com/gonum/gonum) covers matrices, statistics and optimisation. It is still releasing, but has a narrower scope than NumPy. |
| Tabular analysis | [Pandas](https://github.com/pandas-dev/pandas) | [DuckDB](https://duckdb.org/docs/current/clients/go/overview.html) for SQL on local data; [Golars](https://github.com/Gaurav-Gosain/golars) when I need dataframe operations. Golars is newer and needs testing on my workloads. |
| Interactive charts | [Plotly](https://github.com/plotly/plotly.py) | [go-echarts](https://github.com/go-echarts/go-echarts) for general reports; [go-plotly](https://github.com/MetalBlueberry/go-plotly) when I need Plotly.js figure compatibility. Both render through browser JavaScript. |
| Classical ML | [scikit-learn](https://github.com/scikit-learn/scikit-learn) | [GoLearn](https://github.com/sjwhitworth/golearn) offers `Fit`/`Predict` estimators, but I would check its specific algorithms before treating it as a substitute. |
| Model computation | [TensorFlow](https://github.com/tensorflow/tensorflow), [PyTorch](https://github.com/pytorch/pytorch) | [GoMLX](https://gomlx.github.io/docs/backends/) for new Go model code; [tfgo](https://github.com/galeone/tfgo) and [gotch](https://github.com/sugarme/gotch) bind TensorFlow and LibTorch when those runtimes are required. |

[Gota](https://github.com/go-gota/gota) was archived in November 2025, so I
would not start a new dataframe project with it. Gonum published v0.17.0 in
January 2026, evidence of more recent maintenance.
For charts, there is no universal winner: go-echarts has extensive chart
examples, while go-plotly's purpose is to produce Plotly.js figure
specifications. Neither choice establishes a smaller page or binary without
measuring the output I actually ship.

GoLearn handles conventional estimators; GoMLX builds and runs computation
graphs, with a portable pure-Go backend or an XLA backend for acceleration.
tfgo and gotch instead depend on native TensorFlow and LibTorch libraries,
respectively. I would use those bindings only when compatibility with an
existing model or runtime justifies the extra deployment work.

## Development Experience

Go's tooling is exceptional. With [vim-go](https://github.com/fatih/vim-go) in
[Neovim](https://neovim.io/), you get immediate access to formatting, linting,
and code navigation. Unlike JVM languages or JavaScript frameworks that may
require more complex build configurations, Go projects maintain a simple,
predictable structure thanks to `go mod`. The `go fmt` command - triggered on
save by default - enforces consistent code style eliminating debates over
formatting and best practices, while `go vet` catches common mistakes early.

## Error Handling Done Right

Go's approach to error handling initially feels verbose:

```go
result, err := someFunction()
if err != nil {
    return err
}
```

But this explicitness can pay dividends. Treating errors as values makes failure
paths visible, although a programmer can still discard or mishandle them. The
`defer` keyword complements this by scheduling clean-up when the surrounding
function returns:

```go
file, err := os.Open("data.txt")
if err != nil {
    return err
}
defer file.Close()
```

## ML/AI Capabilities

Go is a good fit for an AI service that calls a model, handles its output and
exposes an API: the standard library covers much of that work. The libraries
above add numerical methods, local analysis or model computation only when the
project needs them. I would still use Python for a research method or model
implementation that lacks a suitable Go option.

## Language Design

Go's refreshingly concise specification (under 50 pages) contrasts sharply with
other languages. Even the highly promising Zig, a younger language half of Go's
age, has a 74-page specification despite being positioned as a simpler low-level
language.

<figure>
    <img src="/images/Zig%20language%20spec.png" alt="Zig language specification page count" width="80%" height="80%"/>
    <figcaption>Zig's language spec</figcaption>
</figure>

Go's intentionally limited feature set and strong conventions can promote
uniform code that is easier to review. It still permits multiple designs, and a
specification's page count is at best a rough proxy for language complexity.

<figure>
    <img src="/images/Go%20language%20spec.png" alt="Go language specification page count" width="80%" height="80%"/>
    <figcaption>Go's language spec</figcaption>
</figure>

For ML engineers and developers seeking a reliable, low-overhead language for
production applications, Go offers a compelling choice. Its simplicity,
performance, and consolidated toolchain made it worth exploring, even though its
ML ecosystem was much smaller than Python's.

## Conclusion

To me, Go stands out as a pragmatic choice for modern development through its
key strengths:

- A relatively small language surface
- Integrated formatting, testing and package management
- Explicit error values and structured clean-up via `defer`
- A smaller but growing ML/AI ecosystem
- Cross-platform compilation and efficient garbage collection
- Strong conventions that can reduce team friction
- Lightweight development environment compared to JVM, .NET, BEAM or Node.js

That was my January 2025 conclusion: Python remained much stronger for ML
research and exploratory data work, while Go looked attractive for services,
command-line programs and deployment-sensitive components. The October 2026
stack above has narrowed some of the practical gaps for my work. I now start new
application-focused projects in Go, add libraries only for the capabilities
they supply, and use Python when a particular research method or model
implementation makes it the better tool.

---

[^1]:
    Vet is - in essence - a linter, since it helps improve code quality.
    Quoting Go's [vet doc](https://go.dev/src/cmd/vet/doc.go) _"Vet examines Go
    source code and reports suspicious constructs, such as Printf calls whose
    arguments do not align with the format string. Vet uses heuristics that do
    not guarantee all reports are genuine problems, but it can find errors not
    caught by the compilers."_

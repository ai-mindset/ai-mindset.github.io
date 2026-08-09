---
layout: post
title: "🚀 A Minimal, Pragmatic Approach to Production-Ready AI & ML with Go"
date: 2025-01-26
tags: [
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

**TL;DR:** This January 2025 snapshot explored Go as a compact language with an
integrated formatter, test runner and cross-compilation support. Go had
libraries covering several AI-adjacent tasks, but rough functional analogues
were not equivalent to Python's scientific ecosystem. The experiment was most
persuasive for services and command-line tools, not model research.

**Edit: August 2026 - This article describes an earlier stage of language
experimentation. Trialing Go, Rust, Zig and Elixir led me to settle on Deno with
TypeScript as my monolingual setup for AI Engineering and Data Science as I move
away from Python.**

<!--more-->

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

These are rough functional analogues, not claims of equal maturity or API
coverage:

| Domain              | Python library                                                                                        | Go option                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Numerical computing | [NumPy](https://github.com/numpy/numpy)                                                               | [Gonum](https://github.com/gonum/gonum)                                            |
| Data processing     | [Pandas](https://github.com/pandas-dev/pandas)                                                        | [Gota](https://github.com/go-gota/gota)                                            |
| Visualisation       | [Plotly](https://github.com/plotly/plotly.py)                                                         | [go-plotly](https://github.com/MetalBlueberry/go-plotly)                           |
| Gradient boosting   | [XGBoost](https://github.com/dmlc/xgboost)                                                            | [go-xgboost](https://github.com/Unity-Technologies/go-xgboost)                     |
| Machine learning    | [scikit-learn](https://github.com/scikit-learn/scikit-learn)                                          | [GoLearn](https://github.com/sjwhitworth/golearn)                                  |
| Deep learning       | [TensorFlow](https://github.com/tensorflow/tensorflow), [PyTorch](https://github.com/pytorch/pytorch) | [tfgo](https://github.com/galeone/tfgo), [gotch](https://github.com/sugarme/gotch) |
| LLM applications    | [LangChain](https://github.com/langchain-ai/langchain)                                                | [langchaingo](https://github.com/tmc/langchaingo)                                  |
| Vector search       | [Weaviate Python client](https://github.com/weaviate/weaviate-python-client)                          | [Weaviate Go client](https://github.com/weaviate/weaviate-go-client)               |

_Update: [Awesome Golang.ai](https://github.com/Promacanthus/awesome-golang-ai)
is a very nice curated list of AI-related Go libraries worth checking._

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

While Go isn't the primary choice for ML/AI experimentation, its simplicity and
performance make it excellent for production deployments. Its standard library
and growing ecosystem provide solid foundations for numerical computing
([gonum](https://github.com/gonum/gonum)), data processing
([gota](https://github.com/go-gota/gota)), and ML/AI applications
([Gorgonia](https://github.com/gorgonia/gorgonia),
[tfgo](https://github.com/galeone/tfgo),
[gotch](https://github.com/sugarme/gotch)). The language's focus on simplicity
and performance makes it particularly suitable for model serving and inference
workloads.

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

Python remained much stronger for ML research and exploratory data work, while
Go was attractive for services, command-line programs and deployment-sensitive
components. Its design philosophy aligned with my desire to reduce tooling
complexity, but adopting it for a whole AI practice would have exchanged
toolchain simplicity for gaps in libraries and interactive analysis.

---

[^1]: Vet is - in essence - a linter, since it helps improve code quality.
    Quoting Go's [vet doc](https://go.dev/src/cmd/vet/doc.go) _"Vet examines Go
    source code and reports suspicious constructs, such as Printf calls whose
    arguments do not align with the format string. Vet uses heuristics that do
    not guarantee all reports are genuine problems, but it can find errors not
    caught by the compilers."_

---
layout: post
title: "💡 TIL: A Reactive Python Notebook That Might Replace Jupyter"
date: 2025-03-22
tags: [
  til,
  data-science,
  python,
  best-practices,
  reproducibility,
  literate-programming,
  jupyter-alternative,
  reactivity,
]
---

**TL;DR:** Marimo stores notebooks as Python files and derives cell execution
from variable dependencies. Its reactive model removes several common
out-of-order execution problems and produces cleaner Git diffs, although
mutation, external data and environment differences can still affect
reproducibility.

<!--more-->

## Introduction

As a long-time Vim/Neovim and IPython user, I'm quite particular about my
development environment. So when I say a notebook platform caught my attention
enough to consider switching, that's significant. Recently, I stumbled upon
[Marimo](https://marimo.io/), and it might just be the Jupyter alternative I've
been searching for.

## What is Marimo?

Marimo is a reactive Python notebook environment that addresses several
long-standing issues with traditional notebooks. Unlike the standard Jupyter
`.ipynb` format, which stores JSON containing code, metadata and often outputs,
Marimo notebooks are Python files that are:

- **Reactive**: Run a cell, and Marimo automatically runs dependent cells or
  marks them as stale
- **State-aware**: Deleting a cell removes its variables, although in-place
  mutation and external state still need care
- **Executable**: Can run as standard Python scripts from the command line
- **Git-friendly**: Since they're `.py` files, they work naturally with version
  control
- **Deployable**: Easily share as interactive web apps or slides

## Why This Matters for Literate Programming

Literate programming - the approach of writing code as a narrative explanation
interleaved with executable components - is incredibly powerful for data
science, ML, and AI work. It helps create self-documenting, reproducible
research and applications.\
Jupyter's ability to run cells in an arbitrary order is flexible, but the saved
document may not reveal the order that produced its current state. Marimo
reduces that class of error by deriving execution order from variable
dependencies rather than cell position. It cannot make an analysis reproducible
by itself: package versions, random seeds, data, side effects and mutable
objects still matter.

## Key Features That Won Me Over

1. **Vim keybindings**: As a Neovim user, this is non-negotiable
2. **Modern editor features**: GitHub Copilot integration, AI completion, and a
   variable explorer
3. **Reactive runtime**: No more "did I run all the cells in the right order?"
4. **Interactive elements**: Sliders, tables, and plots that update dependent
   cells
5. **SQL integration**: Write SQL against DataFrames and other sources in the
   notebook
6. **Package management**: Built-in support for dependency tracking and isolated
   environments
7. **Pure Python storage**: No JSON files with embedded outputs making Git diffs
   unreadable

## Comparisons with Other Literate Programming Tools

### Pluto.jl (Julia)

Pluto.jl pioneered the reactive notebook concept that Marimo implements. Both
share:

- Automatic reactivity based on variable dependencies
- Deterministic execution order
- Interactive UI elements

**Differences**:

- Pluto is Julia-specific; Marimo is Python-specific
- Marimo stores notebooks as standard `.py` files; Pluto uses a custom format
- Marimo has more built-in integrations with Python data science libraries
- Pluto has tighter integration with Julia's capabilities

### Livebook (Elixir)

Livebook brings reactive notebooks to the Elixir ecosystem, with:

- Smart cells for common tasks
- Built-in deployment capabilities
- Collaborative editing

**Differences**:

- Livebook embraces Elixir's concurrency model; Marimo follows Python's
- Marimo's Python foundation makes it more accessible for data science work
- Livebook has more built-in tools for building distributed systems

## Pros and Cons

### Pros

- **Reproducibility support**: Dependency-driven execution prevents many "run
  cells in the wrong order" problems
- **Git-friendly**: Pure Python files make version control and collaboration
  easier
- **No hidden state**: Deleted cell variables are removed from memory
- **Deployability**: From notebook to web app with minimal effort
- **Testability**: Run standard test suites against your notebooks
- **Modern IDE features**: Seems like they've thought of everything

### Cons

- **Learning curve**: The reactive model requires a shift in thinking if you're
  used to Jupyter
- **Ecosystem maturity**: Newer than Jupyter, so fewer third-party extensions
- **Performance considerations**: Automatic reactivity needs care around
  expensive computations, although there are ways to mitigate this[^1]
- **Language limitation**: Python-only, unlike Jupyter's support for multiple
  kernels

## Getting Started

Installation is straightforward:

```bash
uv pip install marimo
# or with recommended extras
uv pip install marimo[recommended]

# Try the tutorial
marimo tutorial intro
```

## Conclusion

As someone deeply invested in both Vim/Neovim and the Python data ecosystem,
Marimo strikes an impressive balance. It brings the benefits of reactive
programming to Python notebooks while maintaining the flexibility and
familiarity that Python users expect.\
What sets Marimo apart for me is how directly it addresses execution order and
version control. Treating a notebook as a Python program makes important parts
of its state easier to inspect. Jupyter remains valuable for its mature
ecosystem and multi-language kernels, so the choice depends on collaboration and
deployment needs as much as the execution model.

---

[^1]: Marimo provides a "lazy" configuration option where cells that would be
    automatically re-executed are instead marked as "stale", allowing users to
    manually control when expensive computations run. Users can also implement
    caching strategies using Marimo's built-in caching functionality,
    compartmentalise heavy computations into separate cells to control their
    execution flow, or use the @mo.cell decorator with runtime configurations to
    customise how specific cells behave when dependencies change.

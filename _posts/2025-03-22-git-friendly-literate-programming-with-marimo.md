---
layout: post
title: "💡 TIL: A Reactive Python Notebook That Might Replace Jupyter"
date: 2025-03-22
tags: [til, data-science, python, best-practices, reproducibility, literate-programming, jupyter-alternative, reactivity]
---
<!--more-->

## Introduction

As a long-time Vim/Neovim and IPython user, I'm quite particular about my development environment. So when I say a notebook platform caught my attention enough to consider switching, that's significant. Recently, I stumbled upon [Marimo](https://marimo.io/), and it might just be the Jupyter alternative I've been searching for.

## What is Marimo?

Marimo is a reactive Python notebook environment that solves many long-standing issues with traditional notebooks. Unlike Jupyter, which stores notebooks as JSON with embedded code and outputs, Marimo notebooks are pure Python files that are:

- **Reactive**: Run a cell, and Marimo automatically runs dependent cells or marks them as stale
- **Consistent**: No hidden state problems that plague traditional notebooks
- **Executable**: Can run as standard Python scripts from the command line
- **Git-friendly**: Since they're just `.py` files, they work seamlessly with version control
- **Deployable**: Easily share as interactive web apps or slides

## Why This Matters for Literate Programming

Literate programming -the approach of writing code as a narrative explanation interleaved with executable components- is incredibly powerful for data science, ML, and AI work. It helps create self-documenting, reproducible research and applications.  
The problem with Jupyter has always been that while it looks like literate programming, its execution model (arbitrary cell execution order) and hidden state make it fundamentally unreliable. Marimo solves this by ensuring deterministic execution based on variable dependencies rather than cell position.

## Key Features That Won Me Over

1. **Vim keybindings**: As a Neovim user, this is non-negotiable
2. **Modern editor features**: GitHub Copilot integration, AI completion, and variable explorer
3. **Reactive runtime**: No more "did I run all the cells in the right order?" problems
4. **Interactive elements**: Sliders, tables, and plots that automatically update dependent cells
5. **SQL integration**: Write SQL against dataframes, databases, or other sources right in your notebook
6. **Package management**: Built-in support for dependency tracking and isolated environments
7. **Pure Python storage**: No more JSON files with embedded outputs making git diffs unreadable

## Comparisons with Other Literate Programming Tools

### Pluto.jl (Julia)

Pluto.jl pioneered the reactive notebook concept that Marimo implements. Both share:
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
- Livebook embraces Elixir's concurrency model; Marimo follows Python's execution model
- Marimo's Python foundation makes it more accessible for data science work
- Livebook has more built-in tools for building distributed systems

## Pros and Cons

### Pros
- **Reproducibility**: Deterministic execution eliminates the "run cells in wrong order" problem
- **Git-friendly**: Pure Python files make version control and collaboration much easier
- **No hidden state**: Deleted cell variables are removed from memory
- **Deployability**: From notebook to web app with minimal effort
- **Testability**: Run standard test suites against your notebooks
- **Modern IDE features**: Seems like they've thought of everything

### Cons
- **Learning curve**: The reactive model requires a shift in thinking if you're used to Jupyter
- **Ecosystem maturity**: Newer than Jupyter, so fewer third-party extensions
- **Performance considerations**: Automatic reactivity could cause issues with expensive computations (though there are options to mitigate this[^1])
- **Language limitation**: Python-only, unlike Jupyter which supports multiple kernels

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

As someone deeply invested in both Vim/Neovim and the Python data ecosystem, Marimo strikes an impressive balance. It brings the benefits of reactive programming to Python notebooks while maintaining the flexibility and familiarity that Python users expect.  
What truly sets Marimo apart is how it addresses the fundamental issues of reproducibility and hidden state that have plagued notebooks for years. By treating notebooks as actual programs with deterministic execution, it enables literate programming in a way that Jupyter always promised but never fully delivered.  
Is it perfect? No. But it's the most compelling alternative I've seen so far, and I'm seriously considering making the switch for my daily work.

---
[^1]: Marimo provides a "lazy" configuration option where cells that would be automatically re-executed are instead marked as "stale", allowing users to manually control when expensive computations run. Users can also implement caching strategies using Marimo's built-in caching functionality, compartmentalise heavy computations into separate cells to control their execution flow, or use the @mo.cell decorator with runtime configurations to customise how specific cells behave when dependencies change.

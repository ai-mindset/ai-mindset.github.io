---
layout: post
title: "シ Back to Basics: A Modern, Minimal Python Toolchain"
date: 2024-11-21
tags: [
  python,
  type-checking,
  code-quality,
  toolchain,
  exploration,
  retrospective,
]
---

**Edit: August 2026 - This article captures an earlier return to Python. The
principles still hold, but the specific stack is no longer my daily setup.
Experimenting across Python, Go, Rust, Zig and Elixir ultimately led me to Deno
with TypeScript for AI Engineering and Data Science.**

**TL;DR:** In late 2024, I tried to make Python development feel more cohesive
by choosing one tool for each job: uv for projects and dependencies, Ruff for
linting and formatting, Pyright for type checking, and `pyproject.toml` for
configuration. The lasting lesson was not that this was the definitive Python
stack, but that fewer overlapping tools make it easier to focus on the problem.

<!--more-->

## Why I Wanted a Smaller Toolchain

Python's scientific ecosystem is broad and mature, but its development workflow
can involve many overlapping choices. Package managers, virtual environments,
formatters, linters, type checkers and test runners each have several credible
options. Flexibility is useful, yet choosing and integrating those tools can
become work in its own right.

Exploring Deno showed me the appeal of a runtime with a coherent toolchain. At
the time, I tried to bring that same idea back to Python: select a small set of
tools, give each one a clear responsibility and keep most configuration in one
place.

## The 2024 Stack

| Responsibility            | Choice                                                                                    | Reasoning at the time                                            |
| ------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Style guidance            | [PEP 8](https://peps.python.org/pep-0008/)                                                | A shared baseline for readable Python                            |
| Projects and dependencies | [uv](https://docs.astral.sh/uv/)                                                          | Fast dependency resolution, environments and project management  |
| Project configuration     | [`pyproject.toml`](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/) | One standard home for project metadata and tool settings         |
| Formatting and linting    | [Ruff](https://docs.astral.sh/ruff/)                                                      | One tool covering several code-quality tasks                     |
| Static analysis           | [Pyright](https://github.com/microsoft/pyright)                                           | Useful type feedback before runtime                              |
| Tests                     | [pytest](https://docs.pytest.org/) and doctests                                           | Fast focused tests, with examples kept close to explanatory code |

A minimal configuration looked something like this:

```toml
[project]
name = "my-data-project"
version = "0.1.0"
dependencies = ["polars", "plotly"]

[tool.ruff]
line-length = 90

[tool.pytest.ini_options]
testpaths = ["tests"]
```

The exact dependencies varied by problem. [Polars](https://pola.rs/) and
[Plotly](https://plotly.com/python/) covered much of my tabular and visual work;
[XGBoost](https://xgboost.ai/) or a deep-learning framework came in only when
the task justified them. For AI applications, local inference tools and
retrieval libraries were optional components rather than mandatory parts of
every project.

That distinction matters. A compact toolchain is not the same as installing a
catalogue of libraries in advance. Minimalism comes from adding a dependency
when it earns its place.

## What Aged Well

Several principles survived the change in language:

1. **Give each tool a clear job.** Overlap makes failures and configuration
   harder to reason about.
2. **Keep configuration discoverable.** A new contributor should not have to
   search several hidden files to understand a project.
3. **Automate repeatable checks.** Formatting, static analysis and tests should
   be cheap enough to run routinely.
4. **Prefer boring interfaces.** Stable formats and documented commands matter
   more than novelty.
5. **Choose libraries per problem.** A tool belongs in the stack because the
   work needs it, not because it is fashionable.

## What Changed

The experiment improved Python's ergonomics, but it did not remove the split
between the language, package manager, formatter, linter, type checker and
runtime. I eventually found that I valued Deno's integrated model more than
access to every Python-specific library.

That does not make Python a poor choice. For teams built around PyTorch,
scikit-learn or other Python-first systems, the ecosystem advantage can outweigh
the tooling cost. My own trade-off is different: I now prefer Deno with
TypeScript as a monolingual setup and cross the language boundary only when a
project genuinely requires it.

## Conclusion

This stack was a useful step rather than a destination. Its main contribution
was a decision rule I still use: reduce incidental tooling until what remains
directly supports the work. The tools may change, but that principle travels
well.

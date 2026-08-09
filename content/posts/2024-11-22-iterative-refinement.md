---
layout: post
title: "🔄 Iterative Refinement Alongside Unit Testing"
date: 2024-11-22
tags: [
  fast-ai,
  answer-ai,
  iterative-refinement,
  doctests,
  best-practices,
  llm,
  dialogue-engineering,
  code-quality,
]
---

**TL;DR:** Short feedback loops, doctests and end-to-end experiments complement
rather than replace unit tests. Keep executable examples near explanatory code,
use focused tests for stable behaviour and add broader checks at boundaries
where components can fail together. The aim is evidence at the cheapest useful
level, not loyalty to one testing style.

<!--more-->

## Introduction

Peter Norvig, Jeremy Howard and Grant Sanderson work in different domains, but
each demonstrates iterative refinement: create a small working artefact, inspect
it and improve it in short cycles. I originally framed this as an alternative to
unit testing. That was a false choice. Doctests are tests, and rapid iteration
is safer when the feedback loop includes the right checks.

## Executable Examples

Before Python included `doctest`, Peter Norvig created a small
[`docex` module](https://norvig.com/docex.html) for examples that could be
executed from documentation. Python has supported the
[`doctest`](https://docs.python.org/3/library/doctest.html) module directly
since version 2.1:

```python
def factorial(n: int) -> int:
    """Return n factorial.

    >>> [factorial(n) for n in range(6)]
    [1, 1, 2, 6, 24, 120]
    >>> factorial(-1)
    Traceback (most recent call last):
        ...
    ValueError: n must be non-negative
    """
    if n < 0:
        raise ValueError("n must be non-negative")
    return 1 if n == 0 else n * factorial(n - 1)
```

Doctests make small examples visible and executable. They work well for stable,
deterministic interfaces and educational code. They become brittle when output
is large, non-deterministic or sensitive to formatting, so those cases belong in
ordinary tests.

## Three Forms of Iteration

### Peter Norvig: Code, Explanation and Check Together

Norvig's [spell corrector](https://norvig.com/spell-correct.html) develops a
compact program alongside examples and evaluation. The value is proximity: an
explanation can be checked against the behaviour it describes.

### Jeremy Howard: Make the Whole Path Work Early

Howard's fast.ai approach favours getting an end-to-end path working before
optimising its parts. [Solve It](https://solve.it.com/) extends that rhythm
to [Dialogue Engineering](/posts/dialogue-engineering.html): use a language
model conversationally, inspect each result and keep tightening the
specification.

This makes integration problems visible early, but it does not prove that
individual components behave correctly across edge cases.

### Grant Sanderson: Render and Inspect

In [How I animate](https://www.youtube.com/watch?v=rbu7Zu5X1zI), Grant Sanderson
builds a visual explanation incrementally and previews the result repeatedly.
Visual inspection is essential for this work because a technically valid render
can still communicate badly.

## Match the Check to the Risk

A useful test portfolio might include:

1. **Doctests** for small public examples that should remain valid.
2. **Unit tests** for important logic, edge cases and error handling.
3. **Property-based tests** for invariants across many generated inputs.
4. **Integration tests** for boundaries such as databases, files and APIs.
5. **End-to-end evaluations** for the behaviour users actually experience.
6. **Human inspection** where quality is contextual, visual or linguistic.

Tests become stale when they are not maintained or run. That is a process
failure, not a weakness unique to unit testing. Running a small reliable suite
continuously is more valuable than owning a large ceremonial one.

## Conclusion

Iterative refinement supplies momentum and fast evidence. Focused tests protect
behaviours that should not regress. The combination is stronger than either
caricature: prototype the whole path, inspect reality and add automated checks
where a failure would be costly or easy to repeat.

As Abelson and Sussman wrote, "Programs must be written for people to read, and
only incidentally for machines to execute." Tests and executable examples should
help with both.

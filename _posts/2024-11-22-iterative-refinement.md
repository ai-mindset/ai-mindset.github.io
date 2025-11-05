---
layout: post
title: "🔄 Considering Iterative Refinement Over Unit Testing"
date: 2024-11-22
tags: [fast-ai, answer-ai, iterative-refinement, doctests, best-practices, llm, dialogue-engineering, code-quality]
---

**TL;DR:** Drawing inspiration from Norvig, Howard, and Sanderson, this article advocates for iterative refinement over traditional unit testing, emphasising techniques like doctests that keep verification close to code-reducing maintenance burden whilst improving reliability by focusing on actual usage patterns rather than rigid test-driven development that can lead to outdated tests and ossified code structures.
<!--more-->

## Introduction

In the realm of software development and related fields, three influential figures -Peter Norvig (former Director of Research at Google), Jeremy Howard (founder of fast.ai), and Grant Sanderson (creator of 3Blue1Brown)- demonstrate the power of iterative refinement over rigid test-driven development. Their approaches, while applied in different domains, share common principles that challenge traditional development practices.

## Iterative Refinement

### Peter Norvig's Software Development

Norvig's approach, demonstrated in both his [original `docex` module](https://norvig.com/docex.html) and his [spell corrector implementation](https://norvig.com/spell-correct.html), emphasises tests that are tightly coupled with the code they verify. Before Python's doctests[^1] were officially supported, he created the `docex` module specifically to write tests in docstrings using a concise syntax like

```python
def factorial(n):
    """Return the factorial of n, an exact integer >= 0.
       >>> [factorial(n) for n in range(6)]
       [1, 1, 2, 6, 24, 120]
       It must also not be ridiculously large:
       >>> factorial(1e100)
       Traceback (most recent call last):
       ...
       OverflowError: n too large
    """
    ...

if __name__ == "__main__":
    import doctest
    doctest.testmod()
```

```console
$ python fact.py -v
Trying:
    [factorial(n) for n in range(6)]
Expecting:
    [1, 1, 2, 6, 24, 120]
ok
Trying:
    factorial(1e100)
Expecting:
    Traceback (most recent call last):
        ...
    OverflowError: n too large
ok
2 items passed all tests:
   1 test in __main__
   6 tests in __main__.factorial
7 tests in 2 items.
7 passed.
Test passed.
$
```

Even in his spell corrector, Norvig uses simple functions with in-line test cases rather than separate test files. This approach keeps tests close to the code they verify, making them part of the living documentation rather than separate artefacts that can drift out of sync.\ _Update: While randomly skimming through PyTorch code, it was good to stumble across examples of [code containing doctests](https://github.com/pytorch/pytorch/blob/main/torch/autograd/grad_mode.py)._

### Jeremy Howard's Machine Learning Development

Howard's methodology, evidenced in fast.ai's development and his book "Deep Learning for Coders" advocates for rapid prototyping in notebooks. His emphasis lies in getting end-to-end solutions working quickly, then iteratively improving them based on actual usage patterns. In his latest course [SolveIt](https://solveit.fast.ai/), Howard extends this iterative philosophy to [Dialogue Engineering]({{ site.baseurl }}{% link _posts/2024-11-15-dialogue-engineering.md %}), i.e. using Large Language Models in an iterative conversation to develop solutions, demonstrating how modern AI can be integrated into the development workflow while maintaining the principles of continuous refinement.

### Grant Sanderson's Visual Mathematics

This iterative philosophy extends to mathematical animations. In Grant Sanderson's [How I animate](https://www.youtube.com/watch?v=rbu7Zu5X1zI) video, he demonstrates how he builds visualisations incrementally, starting with basic shapes and gradually refining them while continuously previewing the results. This approach allows for creative exploration while maintaining momentum.

### The Problem with Traditional Testing

Traditional unit testing often fragments development workflow by requiring separate test maintenance and can lead to ossified code structures. When tests aren't exercised regularly, they become outdated, creating false confidence. This is particularly problematic in rapidly evolving domains like AI, where interfaces and requirements frequently change.

## Conclusion

Instead of extensive unit test suites, it's worth considering:

1. Writing working code first
2. Using doctests for critical functions
3. Relying on end-to-end validation
4. Refactoring based on actual usage patterns
5. Keeping tests focused on stable interfaces

This approach reduces maintenance burden while ensuring code remains reliable where it matters most, that is in production.

"_Programs must be written for people to read, and only incidentally for machines to execute_"- Abelson & Sussman. The same applies to tests.

---

[^1]: Python has supported
    [doctests](https://docs.python.org/3/library/doctest.html) natively since
    v2.6.9

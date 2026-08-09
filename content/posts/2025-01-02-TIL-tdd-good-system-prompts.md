---
layout: post
title: "💡 TIL: Test-Driven Development Is Key to Better LLM System Prompts"
date: 2025-01-02
tags: [
  ai,
  llm,
  til,
  prompt-engineering,
  testing,
  best-practices,
  evaluation,
  machine-learning,
  system-prompts,
]
---

**TL;DR:** Amanda Askell described an evaluation-first way to develop system
prompts: collect cases where default behaviour misses the requirement, revise
the prompt, test for intended behaviour and side effects, then repeat. The
resemblance to test-driven development is useful, although probabilistic model
evaluations need broader examples and repeated measurement.

<!--more-->

## Introduction

Simon Willison's
[2024 LLM overview](https://simonwillison.net/2024/Dec/31/llms-in-2024/#evals-really-matter)
emphasised evaluations as an important skill for building useful LLM
applications. One item I took from it was the resemblance between prompt
development and test-driven development.

## The Evaluation-First Approach

[Amanda Askell](https://askell.io/), leading fine-tuning at Anthropic,
[outlines a test-driven process](https://x.com/amandaaskell/status/1866207266761760812)
for system prompts:

1. Create a test set of messages where the model's default behaviour fails to
   meet requirements
2. Develop a system prompt that passes these tests
3. Identify cases where the system prompt is misapplied and refine it
4. Expand the test set and repeat

The method extends beyond prompt engineering. A representative evaluation suite
can make model or prompt changes easier to compare. A
[Vercel account](https://x.com/cramforce/status/1860436022347075667) offers one
example of using tests to support iteration, but a social-media case study is
not a general benchmark.

## Conclusion

Automated evaluation is not sufficient on its own: test cases can be
unrepresentative, graders can disagree with users and failures can shift after
deployment. Its value is that it turns some desired behaviour into repeatable
evidence. Human review, production observation and domain-specific safety checks
still matter.

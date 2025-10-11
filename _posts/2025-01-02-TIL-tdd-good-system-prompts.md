---
layout: post
title: "💡 TIL: Test-Driven Development Is Key to Better LLM System Prompts"
date: 2025-01-02
tags: [ai, llm, til, prompt-engineering, testing, best-practices, evaluation, machine-learning, system-prompts]
---

**TL;DR:** Anthropic's approach to system prompt development parallels test-driven development-first creating test cases where default model behaviour fails, then developing prompts that pass these tests, followed by iterative refinement-highlighting how robust automated evaluation is not merely a quality check but the foundation for building reliable LLM applications.
<!--more-->

## Introduction

2024 has made clear that writing good automated evaluations for LLM-powered systems is the most critical skill for building useful applications. This insight parallels Anthropic's internal approach to system prompt development. As usual, Simon Willison's [recent insightful 2024 LLM overview](https://simonwillison.net/2024/Dec/31/llms-in-2024/#evals-really-matter) was a treasure trove. One item I picked up on was evaluating system prompts using a test-driven approach.

## The Evaluation-First Approach

[Amanda Askell](https://askell.io/), leading fine-tuning at Anthropic, [outlines a test-driven process](https://xcancel.com/amandaaskell/status/1866207266761760812) for system prompts:

1. Create a test set of messages where the model's default behaviour fails to
2. Develop a system prompt that passes these tests
3. Identify cases where the system prompt is misapplied and refine it
4. Expand the test set and repeat
   meet requirements

This methodology's importance extends beyond prompt engineering. Companies with strong evaluation suites can adopt new models faster and build more reliable features than competitors. As [Vercel's experience demonstrates](https://xcancel.com/cramforce/status/1860436022347075667), moving from complex prompt protection to robust testing enables rapid iteration and development.

## Conclusion

While everyone acknowledges evals' importance, implementing them effectively remains challenging. The key insight is clear: robust automated evaluation isn't just a quality check, it's the foundation for building reliable LLM-powered systems.

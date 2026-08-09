---
layout: post
title: "💡 TIL: Incremental AI Problem-Solving with Solveit"
date: 2025-08-26
tags: [til, fast-ai, answer-ai, solveit, ai, best-practices, llm, productivity]
---

**TL;DR:** The Solveit method uses short iterations: understand the problem,
make one small change, inspect the result and revise. Curated context and
editable conversations can make mistakes easier to catch. The method improves
the feedback loop; it does not remove model errors or turn speculative
explanations of model behaviour into facts.

<!--more-->

## Introduction

A student from fast.ai's [Solve It With Code](https://solve.it.com/) course
documented three explanations for deteriorating AI interactions and techniques
that helped. The course, led by [Jeremy Howard](https://x.com/jeremyphoward) and
[Johno Whitaker](https://x.com/johnowhitaker), focuses on systematic
problem-solving through short feedback loops.

The familiar failure pattern is a large initial answer containing broken code,
followed by patches that introduce more errors. Several factors can contribute:
an underspecified task, incorrect generated code, accumulated conversational
mistakes, irrelevant context or a model that is not capable of the task. It
should not be attributed to one universal mechanism without evidence.

## Three Observations and Responses

### 1. Models Often Attempt Too Much at Once

Instruction tuning and preference optimisation can reward apparently complete
answers, while users also commonly ask for complete solutions. Whatever the
cause, a large untested change is hard to diagnose.

Ask for one small step, run it and inspect the evidence before continuing.
Pólya's sequence remains useful: understand, plan, implement and review.

### 2. Errors Accumulate in Long Conversations

Later responses condition on earlier text, including mistaken assumptions and
failed patches. Remove irrelevant material, correct the record and start a fresh
conversation when the context has become misleading. Editable dialogue can help
retain only verified facts and useful artefacts.

This is a context-management technique, not proof that autoregression inevitably
makes every long conversation worse.

### 3. The Model May Lack the Right Source

Model knowledge can be incomplete or stale. Supply the relevant documentation,
code and constraints directly. Tools such as
[contextkit](https://github.com/AnswerDotAI/contextkit) can collect selected
sources, but the user still needs to verify that the model interpreted them
correctly.

Manual curation works well for a small, high-value source set. Automated
retrieval becomes useful when the corpus is too large or changes too often to
curate for each question.

## Application to Modern AI Systems

The method applies to coding agents and research tools as well as chat
interfaces. A useful loop is:

1. State the next observable outcome.
2. Gather only the context needed for that outcome.
3. Make the smallest coherent change.
4. Run a check or inspect the result.
5. Record what the evidence changed about the plan.

This resembles Eric Ries's
[build-measure-learn loop](https://theleanstartup.com/principles): small steps
shorten the distance between an assumption and evidence.

## Conclusion

The Solveit approach turns a large opaque request into a sequence of inspectable
decisions. Smaller changes do not guarantee correctness, but they reduce the
distance between a mistake and the evidence that reveals it.

_Update: Answer.AI
[launched the Solveit course and platform in October 2025](https://www.answer.ai/posts/2025-10-01-solveit-full.html).
The principles also apply to other AI tools._

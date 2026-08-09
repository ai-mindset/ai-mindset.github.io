---
layout: post
title: "💡 TIL: Advice for Mid-Career AI Researchers"
date: 2025-10-02
tags: [til, ai, research, career, learning, advice, perspective]
---

**TL;DR:** A collection of career advice from AI practitioners converges on five
useful habits: build strong coding skills, reproduce work rather than only
reading it, understand one layer below your usual abstraction, share ideas
publicly and choose environments where you can keep learning. The more dramatic
claims in the original thread are motivation, not guarantees.

<!--more-->

## Introduction

Mid-career researchers face a particular problem: experience is valuable, but
familiar methods can become a constraint in a fast-moving field. A
[collection of advice from AI practitioners](https://x.com/chrisbarber/status/1973405958786429285)
prompted me to separate the durable lessons from the more provocative sound
bites.

The result is less a recipe for becoming an expert and more a set of ways to
create useful feedback loops.

## Five Themes Worth Keeping

### 1. Treat Code as an Experimental Medium

Jeremy Howard's advice is to become a better programmer and reproduce
interesting papers from scratch. The value is not the reproduction alone.
Reimplementing a result exposes assumptions that a paper or library interface
can hide, and better code shortens the path from an idea to evidence.

This does not mean every researcher must write kernels. It means knowing when an
abstraction is helping and when it is preventing you from understanding a
result.

### 2. Build as Well as Study

Several contributors recommend moving one layer below the tools you normally
use: write a small agent loop before depending on a framework, inspect the
training loop behind a library, or trace how data reaches an accelerator. The
practical version of this advice is selective. Go deeper where uncertainty or
performance warrants it, not everywhere at once.

Structured courses still provide useful foundations. The suggestions included
[CS231n](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16),
[fast.ai](https://course.fast.ai/),
[MIT 6.S191](https://www.youtube.com/playlist?list=PLtBw6njQRU-rwp5__7C0oIVt26ZgjG9NI),
[MIT 18.06 Linear Algebra](https://www.youtube.com/playlist?list=PLE7DDD91010BC51F8)
and
[CS229](https://www.youtube.com/playlist?list=PLULjW8y9XZKiTBlTFPVDLebgtctNZCgG-).
Building something alongside a course turns passive familiarity into testable
understanding.

### 3. Make Your Work Legible

Good work cannot create opportunities if nobody can find or understand it.
Writing concise technical notes, publishing reproducible experiments and
explaining failed approaches all make a research direction easier for others to
evaluate.

Public visibility is not a call to manufacture a personal brand. A small body of
clear, inspectable work is more useful than a stream of unsupported claims.

### 4. Develop a Point of View Without Worshipping Novelty

One of the stronger observations in the thread is that supposedly solved
problems can still contain neglected details. Independent thinking matters, but
ignoring consensus is not itself evidence of insight. A better rule is to
understand the consensus, identify the assumption you doubt and design an
experiment that could prove you wrong.

That turns contrarianism into research rather than posture.

### 5. Choose for Learning and Fit

Environment compounds. Colleagues, access to compute, feedback and freedom to
investigate all affect the rate at which someone can learn. Compensation
matters, but so do role fit and the ability to do work that remains interesting.

Claims such as being "two weeks away" from the state of the art should be read
as encouragement, not a literal timetable. Access to knowledge has improved;
expertise still takes sustained practice, judgement and evidence.

## A Practical Routine

The advice becomes more useful when converted into actions:

1. Reproduce one result at a scale you can afford.
2. Keep a short experiment log containing the question, method, result and next
   decision.
3. Inspect data and model outputs directly before adding another abstraction.
4. Publish the smallest artefact that another person can reproduce or critique.
5. Reassess periodically whether your environment is increasing your capability
   or merely keeping you busy.

## Conclusion

The thread's most useful message is not that credentials no longer matter or
that anybody can become an expert immediately. It is that progress becomes more
likely when reading, building, inspecting and explaining form a continuous loop.
Strong opinions can suggest what to test; careful work determines which opinions
survive.

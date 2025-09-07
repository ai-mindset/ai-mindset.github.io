---
layout: post
title: "💡 TIL: Incremental AI Problem-Solving with Solveit"
date: 2025-08-26
tags: [til, fast-ai, answer-ai, solveit, ai, best-practices, llm, performance, productivity, prompt-engineering]
---

**TL;DR:** Answer.ai's Solveit approach mitigates LLM deterioration by breaking tasks into small steps, editing AI responses, and providing curated context, addressing three key issues: RLHF-trained overenthusiasm, autoregressive decline, and training data flaws.

<!--more-->

## Introduction
A student from fast.ai's "[Solve It With Code](http://solveit.fast.ai/)" course documented three LLM properties that cause deteriorating AI responses and corresponding mitigation techniques. The course, led by [Jeremy Howard](https://nitter.poast.org/jeremyphoward) and [Johno Whitaker](https://nitter.poast.org/johnowhitaker), focuses on transforming problematic AI interactions into learning experiences through systematic problem-solving.

The approach addresses what the author terms the "deteriorating response pattern" -where AI tools initially appear helpful but produce increasingly broken code through subsequent iterations. The common scenario: Request a weather app from ChatGPT, receive 100 lines of code that doesn't work, request fixes, encounter additional bugs. This occurs due to fundamental LLM properties, not implementation flaws.

## The Three Properties & Solutions
1. _RLHF creates overly eager helpers_

Issue: Human raters prefer complete responses, so models provide overwhelming amounts of information at once
Solution: Work in small steps, ask clarifying questions first
Based on Pólya's problem-solving framework: understand → plan → implement → review

2. _Autoregression leads to deterioration_

Issue: Responses degrade over long conversations as models revert to mediocre training patterns
Solution: Edit the LLM's responses to shape better patterns, pre-fill outputs, use examples
This involves rewriting AI responses to match preferred style, then using those as context for subsequent interactions

3. _Training data is flawed/outdated_

Issue: Hallucinations and outdated information from lossy compression of training data
Solution: "Jeremy RAG" - manually curating relevant context rather than relying on automated retrieval systems
Tools like [contextkit](https://github.com/AnswerDotAI/contextkit) enable inclusion of specific documentation, followed by verification that the LLM correctly interprets the provided context

## Application to Modern AI Systems
The methodology remains relevant for reasoning models like Claude Code or OpenAI's Deep Research. The primary challenge isn't that models cannot answer questions, but rather that users often don't know which questions to ask initially.

Jeremy connected this to Eric Ries' [Lean Startup methodology](https://theleanstartup.com/principles): working in small steps enables adaptation of thinking and refinement of the actual question being posed (paraphrased from the original).

## Conclusion
The Solveit approach transforms problematic AI interactions into learning experiences through iterative, step-by-step problem-solving where each stage builds understanding. By breaking down complex tasks and maintaining control over the conversation flow, users can achieve more reliable results with AI assistants.

_Note: Solveit remains unreleased, but these principles apply to existing AI tools._

Do you find that decomposing complex problems into smaller components reveals different requirements than initially anticipated?

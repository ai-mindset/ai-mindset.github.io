---
layout: post
title: "💡 TIL: I've Been Doing Spec-Driven Development Without Realising"
date: 2026-02-28
tags: [til, ai, agentic-engineering, spec-driven-development, productivity]
---

**TL;DR:** Watching a video on spec-driven development, I recognised a pattern I
had adopted: describe behaviour, constraints and acceptance evidence before
asking a coding agent to implement. A specification reduces some ambiguity, but
it can be incomplete or wrong and must evolve with what the work reveals.

<!--more-->

## Introduction

I stumbled across a video titled
[Spec-Driven Development: AI Assisted Coding Explained](https://www.youtube.com/watch?v=mViFYTwWvcM)
and had one of those "_oh, that's what I've been doing_" moments.

## Spec-Driven Development

The video contrasts **vibe coding**, meaning prompt, generate, tweak and repeat,
with **spec-driven development**, where desired behaviour and constraints are
described before implementation. The presenter uses a strict requirements,
design and implementation sequence. I find the underlying idea more useful than
the "on steroids" comparison with test-driven or behaviour-driven development:
specifications and executable tests answer related but different questions.

## My Experience

I've been doing a form of this for the past few months. When working with coding
agents, I usually start by planning - writing out what I want the system to do,
the constraints, the expected behaviour - before letting the agent loose. Not
always; sometimes a quick script just needs a quick prompt. But for anything
substantial, the planning step has become instinctive.

I wouldn't call what I do vibe coding, though. Simon Willison's term
[**agentic engineering**](https://simonwillison.net/2026/Feb/23/agentic-engineering-patterns/)
captures it better - professional developers amplifying their existing
experience with coding agents, rather than ignoring the code entirely. The
spec-driven approach fits naturally within that: you're not vibing, you're
_directing_.

## Conclusion

What I found useful is the emphasis on reducing ambiguity. In my experience, a
concrete specification often reduces back-and-forth, especially when it includes
observable acceptance criteria. It does not ensure consistent results, and
excessive upfront detail can preserve a mistaken assumption. I therefore treat
the specification as a reviewable working document rather than a complete
contract.

TIL there's a name for what I've been doing.

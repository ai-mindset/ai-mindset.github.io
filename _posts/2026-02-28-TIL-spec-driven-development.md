---
layout: post
title: "💡 TIL: I've Been Doing Spec-Driven Development Without Realising"
date: 2026-02-28
tags: [til, ai, agentic-engineering, spec-driven-development, productivity]
---

**TL;DR:** Watching a video on Spec-Driven Development, I realised I've been practising a form of it for the past year - starting from behaviour specifications and constraints before letting coding agents implement. Combined with Simon Willison's concept of Agentic Engineering, this gave a name to an approach I'd developed through trial and error: directing AI agents with upfront planning rather than iterating through vague prompts.

<!--more-->

## Introduction

I stumbled across a video titled [Spec-Driven Development: AI Assisted Coding Explained](https://www.youtube.com/watch?v=mViFYTwWvcM) and had one of those "_oh, that's what I've been doing_" moments.

## Spec-Driven Development

The video contrasts **vibe coding** - prompt, generate, tweak, repeat - with **spec-driven development**, where you specify desired behaviour and constraints *before* any code gets written. The spec becomes a contract: requirements first, then a design document, then implementation. Nothing gets coded until the spec is approved. The presenter positions it as test-driven development and behaviour-driven development "on steroids", where the spec becomes the primary artifact driving all downstream work.

## My Experience

I've been doing a form of this for the past few months. When working with coding agents, I usually start by planning - writing out what I want the system to do, the constraints, the expected behaviour - before letting the agent loose. Not always; sometimes a quick script just needs a quick prompt. But for anything substantial, the planning step has become instinctive.

I wouldn't call what I do vibe coding, though. Simon Willison's term [**agentic engineering**](https://simonwillison.net/2026/Feb/23/agentic-engineering-patterns/) captures it better - professional developers amplifying their existing experience with coding agents, rather than ignoring the code entirely. The spec-driven approach fits naturally within that: you're not vibing, you're _directing_.

## Conclusion

What I found validating about the video is the emphasis on reducing ambiguity. When you give an agent a spec rather than a vague prompt, you get consistent results. That matches my experience - the more precise my upfront planning, the fewer back-and-forth iterations I need.

TIL there's a name for what I've been doing.

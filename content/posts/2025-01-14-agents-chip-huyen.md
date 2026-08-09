---
layout: post
title: "🤖 Understanding AI Agents: Tools, Planning, and Evaluation"
date: 2025-01-14
tags: [
  ai,
  llm,
  prompt-engineering,
  system-prompts,
  evaluation,
  best-practices,
  toolchain,
  machine-learning,
]
---

**TL;DR:** Chip Huyen describes model-based agents in terms of their
environment, tools, planning and evaluation. Read tools can supply evidence,
capability tools can perform operations, and write tools can change external
state. Reliability depends on evaluating the whole trajectory and constraining
consequential actions, not merely choosing a capable foundation model.

<!--more-->

## Introduction

This article summarises Chip Huyen's post
[Agents](https://huyenchip.com/2025/01/07/agents.html), adapted from her 2025
book _AI Engineering_. Russell and Norvig use "agent" broadly for something that
perceives an environment and acts upon it. Huyen focuses on systems in which a
foundation model selects tools and plans multiple steps. The useful distinction
is not whether a system sounds autonomous, but which actions it can take, what
state it observes and how failures are evaluated.

## Understanding Agents and Their Tools

An agent's effectiveness is determined by two key factors: its environment and
its tool inventory. The environment defines the scope of possible actions, while
tools enable the agent to perceive and act within this environment. Modern
agents leverage three distinct categories of tools.\
Knowledge-augmentation tools, including retrievers and web browsing, can supply
current or private evidence that is absent from model parameters. They do not
prevent stale or false answers unless retrieval and evidence use are evaluated.
Browsing also exposes an agent to untrusted content and prompt injection.
Capability-extension tools can provide calculators or code interpreters, which
need isolation, resource limits and tightly scoped credentials. Write actions
are the most consequential category because they can modify databases, send
messages or trigger other external effects. Least privilege, idempotency,
previews and human approval become more important as reversibility decreases. In
the [Chameleon](https://arxiv.org/abs/2304.09842) paper, the authors reported
gains of 11.37 percentage points on ScienceQA and 17.1 percentage points on
TabMWP over their stated GPT-4 baseline. Those benchmark results demonstrate one
system under one evaluation, not a general return from adding tools.

<figure>
  <a href="https://huyenchip.com/2025/01/07/agents.html"><img src="https://huyenchip.com/assets/pics/agents/8-tool-transition.png" width="80%" alt="A tool-transition tree" /></a>
  <figcaption>A tool-transition tree from the Chameleon example</figcaption>
</figure>

## Planning and Execution Strategies

Effective planning requires balancing granularity and flexibility. While
[Toolformer](https://arxiv.org/abs/2302.04761) managed with 5 tools and
[Chameleon](https://arxiv.org/abs/2304.09842) with 13,
[Gorilla](https://arxiv.org/abs/2305.15334) attempted to handle 1,645 APIs,
illustrating the complexity of tool selection. Plans can be expressed either in
natural language or specific function calls, each approach offering different
advantages in maintainability and precision.\
Foundation-model planners may work without task-specific training but still need
careful instructions and evaluation. Other planners can be trained or
programmed. Agent workflows support sequential, parallel, conditional and
iterative control flow. The [ReAct](https://arxiv.org/abs/2210.03629) framework
interleaves reasoning traces with actions,

<figure>
  <a href="https://huyenchip.com/2025/01/07/agents.html"><img src="https://huyenchip.com/assets/pics/agents/5-ReAct.png" width="80%" alt="The ReAct agent loop" /></a>
  <figcaption>The ReAct agent loop</figcaption>
</figure>

while [Reflexion](https://arxiv.org/abs/2303.11366) uses feedback and stored
reflections to improve later attempts on the paper's tasks.

<figure>
  <a href="https://huyenchip.com/2025/01/07/agents.html"><img src="https://huyenchip.com/assets/pics/agents/6-reflexion.png" width="80%" alt="The Reflexion agent loop" /></a>
  <figcaption>The Reflexion agent loop</figcaption>
</figure>

## Reflection and Error Management

Reflection can support error correction, but a model reviewing its own work is
not independent verification. Validation can occur at the request, plan, tool
arguments, tool result and final outcome. Chameleon's tool-transition analysis
shows how its tools were used together, while Voyager's skill manager stores and
reuses successful behaviours in its environment.

## Evaluation Framework

Agent evaluation requires a comprehensive approach to failure mode analysis.
Planning failures might involve invalid tools or incorrect parameters, while
tool-specific failures demand targeted analysis. Efficiency metrics must
consider not just step count and costs, but also completion time constraints.
When comparing AI and human agents, it's essential to recognise their different
operational patterns - what's efficient for one may be inefficient for the
other. Working with domain experts helps identify missing tools and validate
performance metrics.

## Conclusion

The durable lesson from Huyen's analysis is to evaluate an agent as a system.
More tools enlarge both capability and attack surface; longer plans create more
opportunities for compounding error; reflection can repeat the same mistaken
assumptions. Start with the smallest action space that solves the task, record
trajectories, test realistic failures and require approval before
hard-to-reverse actions. Capability and control need to be designed together.

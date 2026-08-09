---
layout: post
title: "✍ A Path to Maintainable AI Systems using Norman's Design Principles"
date: 2024-12-03
tags: [
  ai,
  data-science,
  design-principles,
  code-quality,
  mlops,
  monitoring,
  observability,
  production,
  model-governance,
  minimal,
]
---

**TL;DR:** Don Norman's principles of visibility, feedback, constraints and
natural mappings provide useful questions for AI system design. Make system
state and uncertainty inspectable, return feedback to the people who can act on
it, constrain dangerous or invalid actions, and connect technical measures to
user outcomes. The principles guide design; they do not prescribe a particular
monitoring stack.

<!--more-->

## Introduction

Don Norman's
[_The Design of Everyday Things_](https://mitpress.mit.edu/9780262525671/the-design-of-everyday-things/)
is about the relationship between an object's design and a person's ability to
understand and use it. AI systems make that relationship unusually difficult:
important state may be distributed across data pipelines, prompts, models,
retrieval, tools and human decisions.

The following adaptation is intentionally tool-agnostic. MLflow, OpenTelemetry,
Prometheus, a database table or a small structured log may each be appropriate.
Adding all of them does not make a system observable if nobody can answer the
operational question at hand.

## 1. Visibility

A person operating the system should be able to see the state needed to make a
decision. Depending on the application, that may include:

- the model, prompt, code and data versions used for a result;
- the evidence retrieved and tools called;
- latency, errors, resource use and queue depth;
- known limitations, confidence signals and whether human review occurred;
- recent changes that could explain a regression.

Visibility is selective. Logging every prompt or document can create privacy,
security and cost problems. Record the minimum information needed for a defined
operational or evaluation purpose, with appropriate retention and access
controls.

## 2. Feedback

Feedback closes the loop between an action and its effect. A successful HTTP
response is not evidence that an answer helped a user. Useful feedback may
combine:

- immediate system signals, such as failures, timeouts and invalid outputs;
- delayed product outcomes, such as correction, completion or abandonment;
- sampled human review against explicit criteria;
- alerts routed to someone who has both context and authority to respond.

Every alert should imply a decision. If a team cannot explain what it will do
when a metric changes, the metric may belong in exploration rather than paging.

## 3. Constraints

Constraints prevent or narrow actions that would be invalid, unsafe or
unexpectedly expensive. Examples include schema validation, least-privilege tool
permissions, spend and rate limits, bounded retries, approval before
consequential writes, and a safe fallback when a dependency fails.

A guardrail is not a proof of safety. Validation only checks the rules that were
expressed, and an LLM-based classifier can fail like any other model. Test
bypasses and false positives, then layer controls according to consequence.

## 4. Natural Mappings

Technical components and measures should map clearly to user and organisational
goals. A retrieval score is not the same as answer correctness, and model
accuracy is not the same as a good decision.

A useful chain is:

1. Name the user outcome.
2. Identify the decision or behaviour that can affect it.
3. Map that decision to system outputs and controllable inputs.
4. Choose measures at each link, including counter-metrics for foreseeable harm.
5. Record assumptions so a later reviewer can challenge the mapping.

## 5. Error Recovery

Good design assumes that components and people will make mistakes. Recovery may
require versioned artefacts, reproducible deployment, a rollback path,
idempotent writes, retained source evidence and a way for users to contest or
correct an outcome.

The recovery path should be exercised before an incident. A model registry entry
that nobody has restored, or a fallback that has not seen current traffic, is
documentation rather than demonstrated resilience.

## A Minimal Implementation Sequence

1. Choose one high-value user journey and list its consequential failure modes.
2. Add a correlation identifier and enough structured events to reconstruct that
   journey without collecting unnecessary personal data.
3. Define a small evaluation set containing normal cases and known failures.
4. Add constraints at irreversible or expensive boundaries.
5. Test one failure and recovery scenario end to end.
6. Introduce another tool only when an unmet requirement justifies its
   operational cost.

## Conclusion

Norman's principles shift the design question from "Which MLOps products should
we install?" to "Can a person understand the system, see the consequence of an
action, avoid predictable mistakes and recover when something fails?" That
framing is durable across tools. A small system that answers those questions can
be more maintainable than a comprehensive stack whose signals, controls and
ownership are unclear.

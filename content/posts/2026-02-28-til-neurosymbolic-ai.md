---
layout: post
title: "💡 TIL: Neurosymbolic AI - Bringing Reason Back Into Intelligence"
date: 2026-02-28
tags: [
  til,
  ai,
  neurosymbolic,
  symbolic-ai,
  neural-network,
  reasoning,
  interpretability,
]
---

**TL;DR:** Neurosymbolic AI combines learned representations or predictions with
explicit symbols, constraints or inference. The aim is to gain some of neural
methods' flexibility and symbolic systems' inspectable structure. It does not
automatically produce understanding or guarantee correct reasoning. mediKanren
illustrates the value of logical queries over biomedical relations; newer work
explores connecting that capability with language models.

<!--more-->

## Introduction

Pedro Domingos'
[The Master Algorithm](https://en.wikipedia.org/wiki/The_Master_Algorithm) lays
out five tribes of machine learning - symbolists, connectionists,
evolutionaries, Bayesians, and analogisers - and argues that the ultimate goal
is a single master algorithm that unifies them all. Neurosymbolic AI feels like
a tangible step toward that vision, bridging at least two of those tribes: the
symbolists and the connectionists.

Symbolic AI first caught my eye when I read about Matt Might's work on
mediKanren - a reasoning engine that digests biomedical literature into logical
relations and infers novel treatments by connecting disparate parts of the
medical knowledge graph. Recently, a concise
[video explainer on Neurosymbolic AI](https://www.youtube.com/watch?v=ZfWDVO3rzeA)
helped crystallise why this hybrid approach matters, and how it connects to work
like Might's.

## The Problem: Pattern Recognition Without Explicit Rules

The video opens with an analogy: a model can reproduce answers without exposing
a stable chain of rules. Neural networks can be effective at pattern
recognition, but a fluent explanation is not necessarily a faithful account of
how a prediction was produced.

Conversely, classical symbolic AI reasons step by step - leaves plus stem equals
plant - but freezes when a cactus shows up. It's logic without intuition.

## Neurosymbolic AI: Both Sides of the Coin

Neurosymbolic AI combines learned components with explicit representations or
inference. In a simplified stop-sign example, a neural component might detect
shapes and colours while a symbolic component applies a rule such as "red and
octagonal implies a likely stop sign". The rule is inspectable, but robustness
still depends on perception, representation and the rule set.

Some systems can also induce or revise rules from examples. That is a research
objective rather than a property shared by every neurosymbolic architecture.

## From Theory to Practice: mediKanren

Matt Might's mediKanren provides a compelling real-world implementation of
neurosymbolic ideas. Might, director of the Hugh Kaul Precision Medicine
Institute at the University of Alabama at Birmingham, created mediKanren after
his son Bertrand was diagnosed with a previously unknown rare disease (NGLY1
deficiency).

mediKanren queries machine-readable biomedical relations, including relations
derived from literature-processing systems, and uses logic programming to
connect them. It can generate hypotheses that link findings across sources.
Those hypotheses still require expert assessment and experimental or clinical
validation.

Work on mediKanren-GPT explores an LLM interface to the symbolic system. A claim
can be checked against relations and rules represented in the knowledge base.
That verifies derivability within the encoded system, not truth in the world;
the source data may be incomplete, wrong or out of date.

## Conclusion

The neurosymbolic approach offers one path for combining statistical learning
with structured inference. mediKanren shows how explicit biomedical relations
can support inspectable hypothesis generation, while also showing why provenance
and validation remain necessary.

Domingos argues for unifying different schools of machine learning.
Neurosymbolic research is one attempt at part of that synthesis, not yet a
single settled architecture.

TIL that neurosymbolic AI isn't the fringe approach I'd assumed it was. I'd
known about its potential since reading about mediKanren, but the relative
silence around it had me second-guessing whether it was gaining real traction.
Seeing it presented as a growing, practical field - with real applications in
science, finance, and law - was a welcome reminder that sometimes the quiet
ideas are the ones worth paying attention to.

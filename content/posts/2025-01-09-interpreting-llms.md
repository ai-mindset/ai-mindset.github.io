---
layout: post
title: "🔍 Understanding LLM Interpretability"
date: 2025-01-09
tags: [
  ai,
  llm,
  machine-learning,
  neural-network,
  model-governance,
  interpretability,
]
---

**TL;DR:** Mechanistic interpretability studies how model computations produce
behaviour. Superposition and polysemantic activations make neuron-by-neuron
accounts difficult. Sparse autoencoders can decompose activations into a larger
set of sparse features, but feature labels and interventions remain partial
evidence rather than a complete explanation of a model.

<!--more-->

## Introduction

Large Language Models (LLMs) have become increasingly sophisticated, yet
understanding their inner workings remains a critical challenge for AI safety
and development. This blog post summarises concepts and research presented in
[Welch Labs' video on mechanistic interpretability](https://www.youtube.com/watch?v=UGO_Ehywuxc),
examining how LLMs process information and recent advances in making their
decision-making processes more transparent.

## How LLMs Compute

LLMs process text through a sophisticated pipeline:

1. Text is converted into tokens and mapped to vectors
2. These vectors flow through multiple layers via "_residual streams_"
3. Each layer transforms the information through attention mechanisms
4. Final outputs emerge from probability distributions across possible tokens

This process, while mathematically precise, creates a black box of neural
connections that resist simple interpretation.

## The Challenge of Model Transparency

[Google Gemma](https://deepmind.google/models/gemma/) models' analysis of the
sentence "_the reliability of Wikipedia is very_" demonstrates this complexity.
The model assigns varying probabilities to different completions:

- "_important_" (20.21%)
- "_high_" (11.16%)
- "_questionable_" (9.48%)

These probabilities emerge from intricate interactions between neurons, leading
to a phenomenon called _superposition_[^1].

## Superposition and Its Solution

Unlike vision models where neurons correspond to specific concepts, LLMs exhibit
[polysemanticity](https://arxiv.org/abs/2210.01892) - individual neurons respond
to multiple, unrelated concepts. This occurs because LLMs encode more concepts
than available neurons by using specific neuron combinations.

This complexity motivated work with
[sparse autoencoders](/posts/sparse-autoencoders.html), which:

1. Approximate activation patterns with combinations of sparse learned features
2. Surface features that researchers may be able to interpret
3. Support interventions that test whether a feature is connected to behaviour

## Practical Implications

Better evidence about model internals could help with:

- **AI Safety**: Finding and testing mechanisms associated with unwanted
  behaviour
- **Development**: More targeted improvements in model capabilities
- **Deployment**: Adding evidence to evaluations of known failure modes
- **Research**: Testing causal hypotheses about how a model computes an output

## Conclusion

Sparse autoencoders have exposed candidate features and enabled useful
experiments, while also revealing how much remains unexplained. A feature that
looks interpretable may omit context, split one concept across several
directions or combine several concepts under a convenient label.

Mechanistic evidence can complement behavioural evaluations, red teaming and
monitoring. It does not by itself make a system safe or reliable.

---

[^1]: superposition in the context of neural networks is the ability of a single
    neuron to represent multiple features simultaneously.
    [https://hdl.handle.net/1721.1/157073](https://hdl.handle.net/1721.1/157073)

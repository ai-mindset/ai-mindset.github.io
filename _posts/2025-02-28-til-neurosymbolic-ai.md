---
title: "💡 TIL: Neurosymbolic AI - Bringing Reason Back Into Intelligence"
date: 2026-02-28
tags: [til, ai, neurosymbolic, symbolic-ai, neural-network, reasoning, interpretability]
---

**TL;DR:** Neurosymbolic AI combines neural networks (pattern recognition) with symbolic logic (structured reasoning) to create systems that can both recognise *and* understand. While neural networks alone can identify a cat but can't explain why, and rule-based systems can reason but break when reality doesn't fit the template, neurosymbolic approaches bridge this gap - with real-world applications like mediKanren already using this hybrid approach to discover novel medical treatments by combining logical inference over scientific literature with LLM capabilities.

<!--more-->

## Introduction

Pedro Domingos' [The Master Algorithm](https://en.wikipedia.org/wiki/The_Master_Algorithm) lays out five tribes of machine learning - symbolists, connectionists, evolutionaries, Bayesians, and analogisers - and argues that the ultimate goal is a single master algorithm that unifies them all. Neurosymbolic AI feels like a tangible step toward that vision, bridging at least two of those tribes: the symbolists and the connectionists.

Symbolic AI first caught my eye when I read about Matt Might's work on mediKanren - a reasoning engine that digests biomedical literature into logical relations and infers novel treatments by connecting disparate parts of the medical knowledge graph. Recently, a concise [video explainer on Neurosymbolic AI](https://www.youtube.com/watch?v=ZfWDVO3rzeA) helped crystallise why this hybrid approach matters, and how it connects to work like Might's.

## The Problem: Recognition Without Understanding

The video opens with an analogy that resonates: current AI is like a student who memorises every answer but doesn't understand the material. Neural networks excel at pattern recognition - tagging photos, generating text - but can't explain _why_ they reach their conclusions. Show them a plastic plant and they'll confidently call it real, because they've learned what plants _look like_, not what they _are_.

Conversely, classical symbolic AI reasons step by step - leaves plus stem equals plant - but freezes when a cactus shows up. It's logic without intuition.

## Neurosymbolic AI: Both Sides of the Coin

Neurosymbolic AI combines the neural (learning) with the symbolic (reasoning). The video's stop sign example illustrates this well: the neural side detects shapes and colours, while the symbolic side applies rules like "_red and octagonal means stop sign_". Even with stickers, lighting changes, or paint, the system still understands _why_ a stop sign looks the way it does.

Importantly, these systems can learn new rules. The whale example from the video demonstrates meta-learning: when a model that's learned "_mammals have fur_" encounters a whale, it can reason - whales give birth to live young and have lungs - and update its logic without retraining on millions of examples.

## From Theory to Practice: mediKanren

Matt Might's mediKanren provides a compelling real-world implementation of neurosymbolic ideas. Might, director of the Hugh Kaul Precision Medicine Institute at the University of Alabama at Birmingham, created mediKanren after his son Bertrand was diagnosed with a previously unknown rare disease (NGLY1 deficiency).

mediKanren digests PubMed abstracts using NLP, extracts simple relations (X inhibits Y, Y causes Z), and layers logical inference on top to discover potential treatments by connecting findings across disparate papers. It's essentially the neurosymbolic approach applied to medicine - neural methods for parsing natural language, symbolic reasoning for drawing logical conclusions.

The team is now developing mediKanren-GPT, which combines the symbolic, explainable approach of mediKanren with LLMs. As Might has noted, mediKanren can _verify_ the assertions coming out of LLMs - if an LLM makes a claim, that claim can be passed to a symbolic AI for verification. This addresses one of the core weaknesses of pure neural approaches: the inability to guarantee factual correctness.

## Conclusion

The neurosymbolic approach represents a path beyond the current limitations of both pure neural networks and rigid rule-based systems. What makes it particularly interesting isn't just the theoretical elegance of combining pattern recognition with structured reasoning - it's that systems like mediKanren are already applying this hybrid approach to discover medical treatments that no human researcher had connected.

As Domingos argued, the real breakthroughs will come from unifying the tribes of machine learning. Neurosymbolic AI is one of the most promising steps in that direction - logic and learning, working hand in hand.

TIL that neurosymbolic AI isn't the fringe approach I'd assumed it was. I'd known about its potential since reading about mediKanren, but the relative silence around it had me second-guessing whether it was gaining real traction. Seeing it presented as a growing, practical field - with real applications in science, finance, and law - was a welcome reminder that sometimes the quiet ideas are the ones worth paying attention to.


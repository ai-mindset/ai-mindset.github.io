---
layout: post
title: "🏺 A Short, Simplified History of AI"
date: 2024-11-23
tags: [ai, evolution, llm, symbolic, neural-network, data-science]
---

**TL;DR:** AI history is not a clean relay from one paradigm to the next.
Symbolic methods, neural networks, probabilistic modelling and analogy-based
learning developed in overlapping waves, lost and regained attention, and are
still combined selectively. Pedro Domingos' five "tribes" are a useful
organising lens, not a complete history.

<!--more-->

# AI's Historical Evolution

## Introduction

Artificial intelligence has undergone shifts in funding, fashion, data and
computing power, but its methods did not arrive in four tidy eras. Drawing from
Pedro Domingos' framework in
[_The Master Algorithm_](https://en.wikipedia.org/wiki/The_Master_Algorithm),
this note looks at several schools that have shaped the field. It is a
conceptual map rather than a comprehensive chronology.

## Historical Evolution

### Symbolic AI and Expert Systems

Much early AI research focused on search, logic and explicit symbol
manipulation. Later expert systems applied hand-authored rules to narrow
domains. These approaches could expose a reasoning chain, but acquiring and
maintaining knowledge was expensive, and brittle rules struggled outside their
intended conditions.

### Neural and Probabilistic Approaches

Neural networks have roots in the 1940s and 1950s, followed by several cycles of
interest. Backpropagation research became especially influential in the 1980s.
Probabilistic and Bayesian methods also developed across decades, providing
explicit ways to model uncertainty and incorporate assumptions. Their data and
computational requirements vary considerably by method.

### More Data, Compute and Representation Learning

During the 2000s and 2010s, larger datasets, GPUs, improved optimisation and
architectural advances made deep learning effective on many perception and
language tasks. Learned representations reduced the need to hand-design every
feature, although data quality, compute, interpretability and robustness
remained important constraints. Analogy-based methods such as nearest neighbours
are another tradition, not a synonym for deep learning.

### Contemporary AI: The Era of Integration (2020s)

Large language models are primarily neural statistical models trained to predict
tokens, even when their output resembles symbolic reasoning. Applications can
combine them with search, code execution, databases, constraint solvers and
other explicit tools. That makes the application hybrid; it does not turn an
attention mechanism itself into a symbolic reasoner. An
[Andrej Karpathy post](https://x.com/karpathy/status/1864033537479135369) offers
one concise interpretation of the current stack.

## Conclusion

AI history reveals recurring ideas rather than a sequence of complete
replacements. Domingos argues for unification, but it is still an open research
position rather than an inevitable destination. In practice, the right
combination depends on the task: a probabilistic model, a rules engine and a
neural network solve different problems and impose different failure modes.

---

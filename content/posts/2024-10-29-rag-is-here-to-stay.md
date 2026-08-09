---
layout: post
title: "🗃️ RAG Is Here To Stay"
date: 2024-10-29
tags: [rag, llm, ai, performance]
---

**TL;DR:** Larger context windows do not remove the need to select, update and
cite information. Retrieval-Augmented Generation (RAG) remains useful when
provenance, changing knowledge or access control matters, while long-context
prompting can be simpler for small, stable collections. Measure both on the task
instead of treating either as a universal answer.

<!--more-->

## Introduction

This post began with a discussion in which
[Simon Willison considered the changing role of RAG](https://x.com/simonw/status/1850928417363149049)
and
[Andriy Burkov challenged claims that it was obsolete](https://x.com/burkov/status/1851159933913280647).
Longer context windows change the trade-offs, but they do not settle them.

## RAG

RAG is not simply a workaround for context limits. It can make the information
entering a model visible, refreshable and attributable. Fine-tuning changes
model behaviour or internal parameters; retrieval supplies evidence at inference
time. They solve different problems and can be combined.

RAG is also not a synonym for vector search. A retriever can use keyword search,
SQL, graphs, filters, vector similarity or a hybrid. On one client project,
plain structured data and existing infrastructure met the requirement without
adding a vector database. That experience reinforced a useful rule: start with
the simplest retrieval method that can satisfy the evaluation.

[Jerry Liu's Latent Space interview](https://www.latent.space/p/llamaindex)
gives a broader overview of RAG system design.

## U-Shaped Performance

One LLM behaviour that should be considered, before regarding RAG obsolete, is
their tendency to attend to information from the beginning and end of the
context window. See
[Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172)
for an empirical analysis.\
The paper found that performance could vary with the position of relevant
evidence and was often weakest when that evidence appeared in the middle of a
long prompt. The result should not be treated as an immutable law for every
newer model, but it demonstrates why a nominal context limit is not the same as
reliable use of every token.

Retrieval has its own failure modes: the relevant passage may not be indexed,
the query may be poorly represented, ranking may be wrong or too much noisy
context may be returned. A useful evaluation separates retrieval recall from the
model's ability to answer with retrieved evidence.

## Conclusion

Long context can reduce retrieval complexity for bounded collections. RAG can
reduce prompt size, update knowledge independently of the model and provide
source-level controls. Hybrid lexical and semantic retrieval, reranking or graph
traversal may help when a simpler baseline fails, but each adds operational
cost.

The right question is not whether RAG is dead. It is which architecture produces
accurate, attributable answers at acceptable latency and cost on the data that
matters.

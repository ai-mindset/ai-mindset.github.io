---
layout: post
title: "🗃️ RAG Is Here To Stay"
date: 2024-10-29
tags: [rag, llm, ai, performance]
---

**TL;DR:** Despite larger LLM context windows, Retrieval-Augmented Generation
(RAG) remains essential for information curation, data provenance, and
overcoming the "lost in the middle" effect where models struggle with
information placed centrally in long contexts-making careful retrieval
strategies more valuable than simply dumping large amounts of text into expanded
context windows.
<!--more-->

## Introduction

This morning I noticed that
[Simon Willison shared some views on RAG](https://xcancel.com/simonw/status/1850928417363149049),
[Andryi Burkov criticised](https://xcancel.com/burkov/status/1851159933913280647)
people who claim that RAG is obsolete, and other RAG-related discussions taking
place sparked by recent longer LLM context windows. Below I'm sharing some
thoughts based on personal experience.

## RAG

RAG is not simply a workaround to context limits, it's a way to carefully curate
information and data. It enables provenance and visibility of the data flowing
through an LLM pipeline -compared to fine-tuning which bakes knowledge into the
model itself. Importantly, RAG is not a synonym of embeddings. Embedding text is
a fantastic way to enable semantic search, especially if it is done in a smart
way (word, sentence, paragraph, or document) given project needs.\
I have successfully reused existing infrastructure to provide one of the largest
companies in the world with the ability to quickly retrieve information through
Q & A. To achieve this, in the context of simplicity and leveraging existing
infrastructure, I opted against adding moving parts like a Vector DB. Instead, I
used plain JSON objects and an agentic system to meet the client's needs. It
worked very well, with feedback from higher management being "_**thank you**,
this is mind-blowing_".\
A nice overview of RAG comes from
[Jerry Liu's interview on Latent Space](https://www.latent.space/p/llamaindex).\
_Update: a useful open-source tool for
[RAGLogging](https://github.com/Brandon-c-tech/RAG-logger) just came out._

## U-Shaped Performance

One LLM behaviour that should be considered, before regarding RAG obsolete, is
their tendency to attend to information from the beginning and end of the
context window. See
[Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172)
for an empirical analysis.\
The paper concludes

> We empirically study how language models use long input contexts via a series
> of controlled experiments. We show that language model performance degrades
> significantly when changing the position of relevant information, indicating
> that models struggle to robustly access and use information in long input
> contexts. In particular, performance is often lowest when models must use
> information in the middle of long input contexts.We conduct a preliminary
> investigation of the role of (i) model architecture, (ii) query-aware
> contextualisation, and (iii) instruction fine-tuning to better understand how
> they affect how language models use context. Finally, we conclude with a
> practical case study of open-domain question answering,finding that the
> performance of language model readers saturates far before retriever recall.
> Our results and analysis provide a better understanding of how language models
> use their input context and provides new evaluation protocols for future
> long-context models.\
> In other words, simply dumping loads of text or embeddings into an LLM with a
> big context window -say 2M tokens- won't yield great results. There's more to
> it than brute forcing.

## Conclusion

Extending context length, as appealing as it may sound, neither simplifies nor
solves the issue of creating a good quality AI system that is enriched by large
text corpora. It seems that when it comes to larger data volumes,
[semantic search augmented with Graph search](https://www.youtube.com/watch?v=5e1Wzbr8wGU)
could be a more robust, albeit more involved, approach. Solid prompt engineering
approaches, including
[Chain-of-Thought](https://www.promptingguide.ai/techniques/cot),
[Few-shot prompting](https://www.promptingguide.ai/techniques/fewshot) etc. are
also powerful tools to keep in our toolbox.

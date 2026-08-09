---
layout: post
title: "💡 TIL: Hybrid RAG - Combining the Best of Sparse and Dense Retrieval"
date: 2025-10-21
tags: [til, rag, llm, retrieval, ai]
---

**TL;DR:** Sparse retrieval such as BM25 is strong at exact terms; dense
retrieval can match semantic similarity; hybrid retrieval combines their ranked
results. Hybrid is a useful default when query types vary, but it adds tuning
and compute and does not guarantee better relevance. Compare sparse, dense and
hybrid baselines on representative queries.

<!--more-->

## Retrieval Supplies Evidence, Not Accuracy

This post is based on a concise and informative video titled
[Hybrid RAG](https://www.youtube.com/watch?v=r0Dciuq0knU) from the IBM
Technology YouTube channel. The video provides an excellent short introduction
to what Hybrid RAG is.

A RAG system's effectiveness depends largely on its retrieval strategy - how it
fetches information to feed into an LLM. The process works by:

1. Processing a user query
2. Retrieving relevant chunks from a knowledge base
3. Feeding those chunks to an LLM

Retrieved evidence affects answer quality, but good retrieval does not guarantee
that a model will use the evidence faithfully. A useful evaluation measures
retrieval and answer generation separately.

![Visual comparison of Sparse, Dense, and Hybrid RAG approaches](/images/Hybrid%20RAG.png)

Let's explore the three major retrieval strategies:

## Sparse Retrieval: Lexical Matching

**How it works**: Scores lexical overlap using methods such as TF-IDF or BM25,
with corpus-level term statistics and document-length normalisation.

**Pros**:

- Simple and fast implementation
- Highly scalable
- Cost-effective (no embeddings required)
- Effective for domain-specific terminology
- Can sometimes outperform complex models for specialised terms

**Cons**:

- Cannot directly match absent synonyms or paraphrases
- Limited contextual understanding
- Struggles with conceptual queries

**Best uses**: Scenarios requiring exact wording - short queries, code search,
log analysis, legal clauses.

**Implementations**: Elasticsearch, Apache Lucene, Milvus

## Dense Retrieval: Learned Similarity

**How it works**: Maps queries and documents into vector space using embeddings
(often called "vector search"), finding results based on semantic similarity.

**Pros**:

- Strong contextual understanding
- Handles synonyms and paraphrasing well
- Flexible for natural language queries
- Captures content meaning effectively

**Cons**:

- Can underweight identifiers, rare terms and exact strings
- Less effective for very short queries
- More computationally intensive
- May require a domain-appropriate embedding model or adaptation

**Best uses**: Chatbots, customer service, research over unstructured knowledge
bases.

**Implementations**: Meta's FAISS, JVector

## Hybrid Retrieval: Combining Ranked Results

**How it works**: Combines vector-based and keyword-based search, processing
queries through both methods and merging results.

**Pros**:

- Leverages strengths of both approaches
- Can outperform either component on mixed query sets
- Gives exact terms and semantic similarity separate routes into the result set
- Handles both semantics and rare terms

**Fusion algorithms**:

- Weighted sum (e.g., 70% dense, 30% sparse)
- Reciprocal Ranked Fusion (RRF), merging based on ranked positions

**Best uses**: Specialised domains (legal, technical, medical) and
general-purpose retrieval requiring high accuracy.

**Implementations**: Elasticsearch, Milvus, Weaviate, DataStax Astra DB

## When Hybrid Retrieval Helps

Hybrid retrieval is most useful when a workload mixes natural-language questions
with product codes, names, technical terms or quotations. Its advantages are
conditional:

1. **Complementary strengths**: Semantic matching for concepts, keyword matching
   for critical terms
2. **Tunable balance**: Fusion weights or rank-based methods can reflect the
   evaluation set
3. **Adaptability**: Works across different domains and query types
4. **Clear ablations**: Each component can be measured alone before the extra
   complexity is accepted

Fusion can also make a weak retriever's noisy results more prominent. Weighted
scores require calibration because dense and sparse scores have different
scales; reciprocal rank fusion avoids direct score comparison but introduces its
own ranking choices.

## Conclusion

Hybrid retrieval is a strong baseline, not a gold standard independent of data.
Start with BM25 and a suitable dense retriever, measure each one, then test
whether fusion improves the errors that matter. Reranking may add more value
than fusion in some systems, while a small collection may need neither.

This TIL was prompted by IBM Technology's short
[Hybrid RAG explanation](https://www.youtube.com/watch?v=r0Dciuq0knU).

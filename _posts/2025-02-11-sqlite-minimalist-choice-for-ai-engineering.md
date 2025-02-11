---
layout: post
title: "🗄️ The Minimalist's DB Choice for AI Engineering is SQLite"
date: 2025-02-11
tags: [ai, data-modeling, data-processing, data-science, go, minimal, production, python, zero-config]
---
<!--more-->

## Introduction

In today's AI engineering landscape, choosing the right database can feel overwhelming. While specialized solutions like [Qdrant](https://qdrant.tech/) (vectors), [Neo4j](https://neo4j.com/) (graphs), and [MongoDB](https://www.mongodb.com/) (documents) excel in their niches, there's a compelling case for [SQLite](https://www.sqlite.org/index.html) as a versatile, minimalist solution that comes pre-installed on most systems and supports multiple data structures effectively. Speaking of minimalist, [Harlequin](https://github.com/tconbeer/harlequin) (borrowing its name from a [sea 🦆](https://en.wikipedia.org/wiki/Harlequin_duck)) makes data exploration very enjoyable. 
Credit for the SQLite idea goes to [Simon Willison](https://bsky.app/profile/simonwillison.net), a prolific AI researcher among many other things, who has been repeatedly posting [blog articles](https://simonwillison.net/tags/sqlite/) and [TILs](https://til.simonwillison.net/sqlite) (Today I Learned) about SQLite since 2003! 

## The Power of Pre-installation

SQLite's ubiquity is remarkable. It comes pre-installed on:
- macOS
- Most Linux distributions (including Ubuntu, as evidenced by its [manifest](https://releases.ubuntu.com/24.10/ubuntu-24.10-desktop-amd64.manifest))
- Python's standard library
- Android devices
- iOS devices

This universal availability means you can start developing immediately without additional setup or installation steps.

## Modern Data Structure Support

Despite its lightweight nature, SQLite handles modern data structures surprisingly well:

1. **Vector Storage**[^1]  
```sql
CREATE VIRTUAL TABLE vec_items USING vec0(embedding float[4])
```
```sql
SELECT
  rowid,
  distance
FROM vec_items
WHERE embedding MATCH ?
ORDER BY distance
LIMIT 3
```

2. **Graph Relationships**[^2]  
```sql
-- Create table `nodes`
CREATE TABLE IF NOT EXISTS nodes (
    id TEXT PRIMARY KEY,
    properties TEXT
)
```
```sql
-- Create table `edges`
CREATE TABLE IF NOT EXISTS edges (
    source TEXT,
    target TEXT,
    relationship TEXT,
    weight REAL,
    PRIMARY KEY (source, target, relationship),
    FOREIGN KEY (source) REFERENCES nodes(id),
    FOREIGN KEY (target) REFERENCES nodes(id)
)
```
```sql
-- Create indices of the `edges` between `source` and `target`, for improved performance
CREATE INDEX IF NOT EXISTS source_idx ON edges(source)
CREATE INDEX IF NOT EXISTS target_idx ON edges(target)
```
```sql
-- Count the no. of incoming and outgoing edges per node, known as 'degree centrality' 
SELECT id,
       (SELECT COUNT(*) FROM edges WHERE source = nodes.id) +
       (SELECT COUNT(*) FROM edges WHERE target = nodes.id) as degree
FROM nodes
ORDER BY degree DESC
LIMIT 10
```

3. **Document Storage**
```sql
CREATE TABLE documents (
    id INTEGER PRIMARY KEY,
    content JSON,
    metadata JSON
);
```

## Portability and Simplicity

One of SQLite's strongest features is its [single-file](https://www.sqlite.org/onefile.html) nature. Your entire database exists in one file that can be:
- Backed up with a simple copy operation
- Easily version controlled (for smaller databases)
- Moved between systems effortlessly
- Examined with standard SQLite tools

## Conclusion

While specialized databases have their place, SQLite offers a compelling combination of features that make it ideal for many AI engineering projects:
- Zero configuration
- Pre-installed availability
- Support for multiple data structures
- Single-file portability
- Wide language support, especially in Python and Go
- ACID[^3] compliance

**TL;DR**: When you need a lightweight, self-contained database that can handle documents, vectors, and graphs without the complexity of a full database server, SQLite is often an excellent choice.

---
[^1]: Example from [sqlite-vec with Python](https://alexgarcia.xyz/sqlite-vec/python.html)
[^2]: Examples from [How to Build Lightweight GraphRAG with SQLite](https://dev.to/stephenc222/how-to-build-lightweight-graphrag-with-sqlite-53le)
[^3]: Atomicity, Consistency, Isolation, Durability ([ACID](https://en.wikipedia.org/wiki/ACID)), per Wikipedia, "_is a set of properties of database transactions intended to guarantee data validity despite errors, power failures, and other mishaps. In the context of databases, a sequence of database operations that satisfies the ACID properties (which can be perceived as a single logical operation on the data) is called a transaction. For example, a transfer of funds from one bank account to another, even involving multiple changes such as debiting one account and crediting another, is a single transaction._"

---
layout: post
title: "🗄️ SQLite: The Minimalist Database for AI Engineering"
date: 2025-02-11
tags: [ai, data-modeling, data-processing, data-science, minimal, production, python, zero-config]
---

**TL;DR:** SQLite offers a zero-configuration, pre-installed database solution ideal for AI engineering projects, supporting modern data structures including vectors, graphs, and JSON documents whilst providing single-file portability, ACID compliance, and broad language compatibility - making it an excellent minimalist choice when specialised database systems would be overkill.
<!--more-->

## Introduction

In today's AI engineering landscape, choosing the right database can feel overwhelming. While specialised solutions like [Qdrant](https://qdrant.tech/) (vectors), [Neo4j](https://neo4j.com/) (graphs), and [MongoDB](https://www.mongodb.com/) (documents) excel in their niches, there's a compelling case for [SQLite](https://www.sqlite.org/index.html) as a versatile, minimalist solution that comes pre-installed on most systems and supports multiple data structures effectively. Speaking of minimalism, [Harlequin](https://github.com/tconbeer/harlequin) (named after a [sea 🦆](https://en.wikipedia.org/wiki/Harlequin_duck)) makes data exploration very enjoyable. Credit for the SQLite idea goes to [Simon Willison](https://bsky.app/profile/simonwillison.net), a prolific AI researcher among others, who has been posting [blog articles](https://simonwillison.net/tags/sqlite/) and [TILs](https://til.simonwillison.net/sqlite) (Today I Learned) about it since 2003!

## The Power of Pre-installation

SQLite's ubiquity is remarkable. It comes pre-installed on:

- macOS
- Most Linux distributions (including Ubuntu, as evidenced by its
- Python's standard library
- Android devices
- iOS devices
  [manifest](https://releases.ubuntu.com/24.10/ubuntu-24.10-desktop-amd64.manifest))

This universal availability means you can start developing immediately without additional setup or installation steps.

## Modern Data Structure Support

Despite its lightweight nature, SQLite handles modern data structures surprisingly well:

1. **Vector Storage**[^1]

```sql
CREATE VIRTUAL TABLE vec_items USING vec0(embedding float[4])
```

```sql
-- vectors can be provided as JSON or in a compact binary format
INSERT INTO vec_items(rowid, embedding)
  VALUES
    (1, '[-0.200, 0.250, 0.341, -0.211, 0.645, 0.935, -0.316, -0.924]'),
    (2, '[0.443, -0.501, 0.355, -0.771, 0.707, -0.708, -0.185, 0.362]'),
    (3, '[0.716, -0.927, 0.134, 0.052, -0.669, 0.793, -0.634, -0.162]'),
    (4, '[-0.710, 0.330, 0.656, 0.041, -0.990, 0.726, 0.385, -0.958]');
```

```sql
-- KNN-style query
SELECT
  rowid,
  distance
FROM vec_items
WHERE embedding MATCH '[0.890, 0.544, 0.825, 0.961, 0.358, 0.0196, 0.521, 0.175]'
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

While specialised databases have their place, SQLite offers a compelling combination of features that make it ideal for many AI engineering projects:

- Zero configuration
- Pre-installed availability
- Support for multiple data structures
- Single-file portability
- Wide language support, especially in Python and Go
- ACID[^3] compliance

**TL;DR**: When you need a lightweight, self-contained database that can handle documents, vectors, and graphs without the complexity of a full database server, SQLite is often an excellent choice.

---

[^1]: Example from
    [sqlite-vec with Python](https://alexgarcia.xyz/sqlite-vec/python.html)

[^2]: Examples from
    [How to Build Lightweight GraphRAG with SQLite](https://dev.to/stephenc222/how-to-build-lightweight-graphrag-with-sqlite-53le)

[^3]: Atomicity, Consistency, Isolation, Durability
    ([ACID](https://en.wikipedia.org/wiki/ACID)), per Wikipedia, "_is a set of
    properties of database transactions intended to guarantee data validity
    despite errors, power failures, and other mishaps. In the context of
    databases, a sequence of database operations that satisfies the ACID
    properties (which can be perceived as a single logical operation on the
    data) is called a transaction. For example, a transfer of funds from one
    bank account to another, even involving multiple changes such as debiting
    one account and crediting another, is a single transaction._"

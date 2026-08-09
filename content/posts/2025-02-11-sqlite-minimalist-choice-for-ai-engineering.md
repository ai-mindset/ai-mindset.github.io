---
layout: post
title: "🗄️ SQLite: The Minimalist Database for AI Engineering"
date: 2025-02-11
tags: [
  ai,
  data-modeling,
  data-processing,
  data-science,
  minimal,
  production,
  python,
  zero-config,
]
---

**TL;DR:** SQLite is an embedded, zero-configuration relational database with
single-file portability, transactions and broad language support. JSON functions
are built in on current releases; vector search needs an extension, and graphs
can be represented with tables and queries rather than a native graph engine. It
is a strong default for local and modest single-writer workloads, not a
replacement for every database server.

<!--more-->

## Introduction

Specialised systems such as [Qdrant](https://qdrant.tech/),
[Neo4j](https://neo4j.com/) and [MongoDB](https://www.mongodb.com/) solve
particular operational problems. [SQLite](https://www.sqlite.org/index.html) is
a useful baseline when an application needs an embedded relational database
rather than another service. [Harlequin](https://github.com/tconbeer/harlequin)
provides a pleasant terminal interface, while Simon Willison's
[SQLite posts](https://simonwillison.net/tags/sqlite/) and
[TILs](https://til.simonwillison.net/sqlite) show the range of small
applications it can support.

## The Power of Pre-installation

SQLite is widely available, though the command-line program is not guaranteed to
be installed on every development machine. It is included in or readily
available for:

- macOS
- Many Linux distributions (including Ubuntu, as evidenced by its
  [manifest](https://releases.ubuntu.com/24.10/ubuntu-24.10-desktop-amd64.manifest))
- Python's standard library
- Android devices
- iOS devices

Bindings embedded in a language or operating system can have different SQLite
versions and compile-time options, so applications should check the features
they need.

## Modern Data Structure Support

SQLite can support several useful representations, with an important distinction
between native features, extensions and application-level schemas:

1. **Vector Storage**[^1]

```sql
CREATE VIRTUAL TABLE vec_items USING vec0(embedding float[8]);
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
);
```

```sql
-- Create indices of the `edges` between `source` and `target`, for improved performance
CREATE INDEX IF NOT EXISTS source_idx ON edges(source);
CREATE INDEX IF NOT EXISTS target_idx ON edges(target);
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
    content TEXT CHECK (json_valid(content)),
    metadata TEXT CHECK (json_valid(metadata))
);
```

## Portability and Simplicity

One of SQLite's strongest features is its
[single-file](https://www.sqlite.org/onefile.html) nature. Your entire database
exists in one file that can be:

- Backed up with a simple copy operation
- Moved between systems effortlessly
- Examined with standard SQLite tools

Copying a live database needs care; use SQLite's backup facilities or a safe
transaction rather than assuming an arbitrary file copy is consistent. Binary
database files also produce poor source-control diffs, so migrations or seed
data are usually better versioned than a changing database file.

## Conclusion

SQLite offers a useful combination of features for local applications and
services with modest write concurrency:

- Zero configuration
- Broad availability
- JSON functions, relational graph schemas and extension-based vector search
- Single-file portability
- Wide language support, including Deno and TypeScript
- ACID[^3] compliance

JSON functions, relational graph schemas and vector extensions let one database
support several data shapes. That convenience should be weighed against
extension maturity, query needs, concurrency and the operational benefits of a
database server.

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

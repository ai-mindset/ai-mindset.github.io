---
layout: post
title: "シ Back to Basics: A Modern, Minimal Python Toolchain"
date: 2024-11-21
tags: [python, type-checking, code-quality, github-actions, ci-cd, cross-platform, minimal, toolchain]
---
<!--more-->

## Introduction
Python's ecosystem for Data Science and AI is unmatched in its depth and maturity. Yet, its fragmented tooling landscape often leads to decision paralysis and opinions galore: virtualenv or venv? pip or conda? black or flake8? These choices, while providing flexibility, can create unnecessary cognitive load and often foster dogmatic opinions about "the right way" to do things.
After exploring alternative stacks, I'm returning to Python. Not least because it's perfect, but because it's productive. The challenge isn't Python's capabilities; it's the abundance and complexity of its tooling. This article presents a carefully curated, minimal toolkit that leverages Python's ecosystem while avoiding its common setup pitfalls.

## Motivation
The appeal of integrated toolchains like Deno 2.0 is undeniable. Zero setup, immediate productivity, and a cohesive development experience. My recent exploration of alternative stacks revealed the value of unified tools that just work. While JavaScript's ecosystem for Data Science and AI is growing rapidly, it still lacks the depth and maturity of Python's scientific computing stack.  
This exploration led to an important realisation: aside from an expansive Data and AI ecosystem, Python development can be achieved with a streamlined workflow that increases productivity and decreases complexity. Rather than accepting the cognitive overhead of multiple competing tools, I decided to create my own compact toolchain that meets most Data Science and AI requirements with minimalism, simplicity, and clarity in mind.
The goal isn't to prescribe another "right way" of doing things, but rather to demonstrate how a carefully chosen set of modern tools can create a development experience that rivals the integrated approaches of newer platforms while leveraging Python's mature ecosystem.  

## My Approach
### Local Development
My toolchain starts with the following foundational choices that eliminate common Python setup headaches:

0. [PEP8](https://peps.python.org/pep-0008/): Let's start with a style guide, so that the team is on the same page  
1. [uv](https://docs.astral.sh/uv/): A blazing-fast Python package and project manager, written in Rust. It replaces pip, pip-tools, pipx, poetry, pyenv, twine, virtualenv, and more, providing: 
    - Consistent dependency resolution
    - Lightning-fast package installations
    - Built-in virtual environment management
    - Direct integration with `pyproject.toml`

2. [`pyproject.toml`](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/): The single source of truth for project configuration. For example:
```toml
    [project]
    name = "my-ds-project"
    version = "0.1.0"
    dependencies = [
        "polars",
        "tensorflow",
        "plotly"
    ]

    [tool.ruff]
    line-length = 90 
    select = ["E", "F", "I"]

    # Required only if you use pytest for unit testing
    [tool.pytest.ini_options]
    testpaths = ["tests"]
```

3.  [Ruff](https://docs.astral.sh/ruff/): A Rust-based tool that combines formatting and linting, replacing the need for black, flake8, isort etc.:
    - Single-tool code quality enforcement
    - Configurable through `pyproject.toml`
    - Significantly faster than Python-based alternatives

4. [pyright](https://github.com/microsoft/pyright): Static Type Checker for Python
    - Static type checker 
    - [Standards](https://htmlpreview.github.io/?https://github.com/python/typing/blob/main/conformance/results/results.html) compliant
    - [Configurable](https://microsoft.github.io/pyright/#/configuration?id=sample-pyprojecttoml-file) within `pyproject.toml` 

5. [iterative refinement]({{ site.baseurl }}{% link _posts/2024-11-22-iterative-refinement.md %}): An approach that tightly couples (doc)tests with code, ensuring [up-to-dateness](https://www.merriam-webster.com/thesaurus/up-to-dateness)  
~~[pytest](https://docs.pytest.org/en/stable/): Handles testing with minimal boilerplate and rich assertions~~

### Cross-Platform Distribution
1. PyInstaller for creating stand-alone executables
2. GitHub Actions workflow for automated builds:
```yaml
- name: Build executables
  run: |
    pyinstaller --onefile src/main.py
```
3. Local cross-compilation using [Podman](https://podman.io/):
```Dockerfile
FROM python:3.13-slim
COPY . /app
WORKDIR /app
RUN pip install pyinstaller
CMD pyinstaller --onefile src/main.py
```

### Data Science
A carefully selected set of powerful libraries that minimize overlap:

- [Polars](https://pola.rs/): Fast DataFrame operations with a cohesive API. [Why?](https://xcancel.com/charliermarsh/status/1860388882015223835)  

```python
    import polars as pl

    def analyse_customer_behavior(path: str):
        return (
            pl.scan_parquet(path)
            .with_columns([
                pl.col("purchase_date").str.to_datetime(),
                (pl.col("amount") * pl.col("quantity")).alias("total_spend")
            ])
            .group_by([
                pl.col("customer_id"),
                pl.col("purchase_date").dt.month().alias("month")
            ])
            .agg([
                pl.col("total_spend").sum().alias("monthly_spend"),
                pl.col("product_id").n_unique().alias("unique_products"),
                pl.col("purchase_date").count().alias("purchase_frequency")
            ])
            .sort(["customer_id", "month"])
            .collect()
        )
```

- [TensorFlow 2](https://www.tensorflow.org/): Deep learning when needed

```python
    import tensorflow as tf
    mnist = tf.keras.datasets.mnist

    (x_train, y_train),(x_test, y_test) = mnist.load_data()
    x_train, x_test = x_train / 255.0, x_test / 255.0

    model = tf.keras.models.Sequential([
      tf.keras.layers.Flatten(input_shape=(28, 28)),
      tf.keras.layers.Dense(128, activation='relu'),
      tf.keras.layers.Dropout(0.2),
      tf.keras.layers.Dense(10, activation='softmax')
    ])

    model.compile(optimiser='adam',
      loss='sparse_categorical_crossentropy',
      metrics=['accuracy'])

    model.fit(x_train, y_train, epochs=5)
    model.evaluate(x_test, y_test)
```

- [XGBoost](https://xgboost.ai/): Gradient boosting for structured data

```python
    from xgboost import XGBClassifier
    # read data
    from sklearn.datasets import load_iris
    from sklearn.model_selection import train_test_split
    data = load_iris()
    X_train, X_test, y_train, y_test = train_test_split(data['data'], data['target'], test_size=.2)
    # create model instance
    bst = XGBClassifier(n_estimators=2, max_depth=2, learning_rate=1, objective='binary:logistic')
    # fit model
    bst.fit(X_train, y_train)
    # make predictions
    preds = bst.predict(X_test)
```

- [Plotly](https://plotly.com/python/): Interactive visualizations

```python
    import plotly.express as px
    df = px.data.iris()
    fig = px.scatter(df, x="sepal_width", y="sepal_length", color="species", symbol="species")
    fig.show()
```
- [MLFlow](https://mlflow.org): Managing the Machine Learning Lifecycle
<center>
    <img src="https://raw.githubusercontent.com/ai-mindset/ai-mindset.github.io/refs/heads/main/images/40_MLFlow.png"/>  
</center><br />

### AI Engineering
With hybrid solutions becoming more prevalent nowadays, we can use a combination of tools.

- [Ollama](https://ollama.com/): Local model deployment and inference
```python
    import ollama

    def technical_advisor():
        messages = [
            {
                "role": "system",
                "content": "You are a technical advisor specializing in Python architecture."
            },
            {
                "role": "user",
                "content": "What's the best way to handle database migrations?"
            }
        ]
        
        response = ollama.chat(model='llama2', messages=messages)
        messages.append(response['message'])
        
        # Follow-up question with context
        messages.append({
            "role": "user",
            "content": "How would that work with SQLAlchemy specifically?"
        })
        
        return ollama.chat(model='llama2', messages=messages)
```

- [LlamaIndex](https://docs.llamaindex.ai/): RAG pipeline construction using local LLMs or external APIs
```python
    from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
    from llama_index.core.node_parser import SentenceSplitter
    from llama_index.core.retrievers import VectorIndexRetriever
    from llama_index.core.query_engine import RetrieverQueryEngine

    def create_custom_rag():
        # Load and parse documents
        documents = SimpleDirectoryReader("technical_docs").load_data()
        parser = SentenceSplitter(chunk_size=1024, chunk_overlap=20)
        nodes = parser.get_nodes_from_documents(documents)
        
        # Create index with custom settings
        index = VectorStoreIndex(nodes)
        
        # Custom retriever with similarity threshold
        retriever = VectorIndexRetriever(
            index=index,
            similarity_top_k=3,
            filters=lambda x: float(x.get_score()) > 0.7
        )
        
        # Create query engine with custom retriever
        query_engine = RetrieverQueryEngine(retriever=retriever)
        return query_engine
```

- [MongoDB](https://www.mongodb.com/): A distributed document DB that supports vector storage and graph operations
```python
    from pymongo import MongoClient
    import numpy as np

    def vector_search(text_embedding: np.ndarray, threshold: float = 0.8):
        client = MongoClient("mongodb://localhost:27017/")
        db = client.vector_db
        
        pipeline = [
            {
                "$search": {
                    "index": "vector_index",
                    "knnBeta": {
                        "vector": text_embedding.tolist(),
                        "path": "embedding",
                        "k": 5
                    }
                }
            },
            {
                "$match": {
                    "score": {"$gt": threshold}
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "text": 1,
                    "score": {"$meta": "searchScore"}
                }
            }
        ]
        
        return list(db.documents.aggregate(pipeline))
```  

_Update: Looking into [Weaviate](https://weaviate.io/) as an all-in-one DB solution._

This stack provides everything needed for modern Data Science and AI work while maintaining clarity and minimising tool overlap.

## Conclusion
Returning to Python with this minimal, modern toolchain has proven to be a pragmatic choice. The combination of uv, Ruff, and Pytest creates a more unified development workflow, while retaining access to Python's mature scientific computing ecosystem.

Key benefits of this approach:
1. **Reduced Cognitive Load**: One tool per task eliminates decision fatigue
2. **Modern Performance**: Rust-based tools (uv, Ruff) provide near-instant feedback
3. **Simplified Configuration**: Single `pyproject.toml` as source of truth
4. **Production Ready**: Direct path from development to cross-platform deployment
5. **Full Feature Set**: Complete Data Science and AI capabilities without bloat
6. **Flexible AI Stack**: Seamless integration between local models (Ollama), RAG pipelines (LlamaIndex), and vector storage (MongoDB)
7. **Production AI**: Easy transition from experimentation to production AI systems with consistent tooling

While Python's ecosystem will likely remain fragmented, we don't have to accept the complexity. By carefully choosing modern tools that prioritise speed, simplicity, and clarity, we can create a development environment that's both powerful and pleasant to use.

The beauty of this approach lies not in its prescriptiveness, but in its principles: _minimize tooling_, _maximise capability_, and _maintain clarity_. Whether you adopt this exact stack or use it as inspiration for your own, the goal remains the same: bring the focus back to solving problems rather than managing tools.

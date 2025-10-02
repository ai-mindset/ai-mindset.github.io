---
layout: post
title: "🦀 Transitioning from Python to Rust: A Minimalist Approach"
date: 2025-09-25
tags: [rust, python, ai-engineering, data-science, migration, type-safety, performance, productivity, software-minimalism]
---

**TL;DR:** Moving from Python to Rust for AI work requires a phased approach
focusing on self-contained utilities first, leveraging PyO3 for hybrid
integration, and adopting a minimal subset of Rust features before expanding.
This strategy maintains productivity while gradually unlocking Rust's type
safety, performance, and cross-platform deployment advantages.
<!--more-->

## Introduction

After previously discussing the potential of doing AI and Data Science with
[Deno](https://ai-mindset.github.io/posts/deno.html) or
[Go](https://ai-mindset.github.io/posts/go-pragmatic-modern-development.html),
I've found Rust to be a compelling alternative, offering an ecosystem that
covers my needs, memory safety without garbage collection, and a single-binary
deployment model.\
Four Rust libraries, namely

- [Rig](https://rig.rs/) for LLM applications
- [ndarray](https://docs.rs/ndarray/) for linear algebra
- [plotters](https://plotters-rs.github.io/home/) for visualisation
- [Polars](https://docs.pola.rs/) for DataFrames\
  already cover 90+% of an AI Engineer's and a Data Scientist's needs.

## Phased Migration Strategy

**1. Start with small, self-contained utilities**

- Begin by rewriting simple command-line tools or utilities
- Focus on pure functions with clear inputs/outputs
- Examples: data processors, validators, or simple APIs

**2. Learn incrementally through practical patterns**

```rust
// Python:
def process_data(items):
    return [x * 2 for x in items if x > 0]

// Rust equivalent:
fn process_data(items: &[i32]) -> Vec<i32> {
    items.iter().filter(|x| **x > 0).map(|x| x * 2).collect()
}
```

**3. Adopt a hybrid approach during transition**

- Use [PyO3](https://pyo3.rs/) to call your new Rust code from existing Python
- Gradually replace performance-critical components first
- Keep Python for rapid prototyping until comfortable with Rust

**4. Leverage familiar concepts across languages**

- Rust's iterators ≈ Python's generators
- Rust's closures ≈ Python's lambda functions
- Rust's Option/Result ≈ Python's Optional/try-except

## Keeping Rust Simple and Robust

**1. Start with a subset of Rust features**

- Focus on structs, enums, and basic pattern matching
- Defer learning advanced traits, lifetimes, and generics
- Use `#[derive]` macros to avoid boilerplate

**2. Adopt consistent patterns**

```rust
// Prefer simple error handling patterns
fn get_user(id: u64) -> Result<User, Error> {
    let user = db.find_user(id)?; // Early return on error
    Ok(user)
}
```

**3. Minimise complexity with good defaults**

- Use `String` over `&str` for return values until comfortable with lifetimes
- Start with `Vec<T>` before learning specialised collections
- Prefer `.clone()` initially where ownership is complex

**4. Focus on idiomatic Rust patterns**

- Prefer composition over inheritance
- Use enums for representing state
- Leverage the type system to make invalid states unrepresentable

**5. Practical tooling setup**

- Install `rust-analyzer` for your Editor / IDE of choice
- Use `clippy` to learn idiomatic Rust: `cargo clippy`
- Adopt `cargo fmt` for consistent formatting

This approach prioritises practical learning over theoretical completeness,
allowing you to become productive quickly while gradually adopting Rust's more
powerful features as needed.

## Conclusion

Migrating from Python to Rust can offer considerable long-term benefits,
including a cohesite ecosystem, native performance, and streamlined deployment,
without requiring complete rewrites. Following a gradual migration path,
leveraging hybrid integration, and deliberately limiting the developer's initial
exposure to Rust's complexity, one can maintain productivity while acquiring
experience. This approach can lead to a minimalist software development cycle
that will result in increasingly robust software over time.

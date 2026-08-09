---
layout: post
title: "💡 TIL: Claude Skills and Progressive Disclosure"
date: 2025-10-17
tags: [til, ai, claude, llm, productivity]
---

**TL;DR:** Claude Skills package instructions, scripts and resources into
reusable folders. Their most interesting design idea is progressive disclosure:
expose enough metadata to discover a skill, then load its detailed guidance only
when a task calls for it.

<!--more-->

## What Are Claude Skills?

[Anthropic's Claude Skills](https://www.anthropic.com/news/skills) are folders
containing instructions, scripts and resources for specialised tasks. The system
uses a skill's metadata to decide when its detailed instructions may be
relevant.

Key characteristics:

- **Composable**: More than one skill can contribute to a task
- **Portable in principle**: A folder-based format is easier to inspect and move
  than instructions embedded in a proprietary interface
- **Context-conscious**: Discovery metadata can remain small while detailed
  material is loaded on demand
- **Practical**: A skill can include executable helpers and reference material
  as well as prose

## Technical Implementation

The efficiency of Claude Skills comes from their implementation:

1. Skills use YAML frontmatter in Markdown files,
   [as described by Simon Willison](https://simonwillison.net/2025/Oct/16/claude-skills/).
   - _YAML frontmatter_: Structured metadata (delimited by triple dashes `---`)
     at the beginning of Markdown files containing required `name` and
     `description` fields that Claude scans at startup to determine which skills
     are relevant to a task

2. When a task matches, the assistant can read the full instructions and then
   select any supporting scripts or references.
3. Keeping discovery separate from execution limits the context used before a
   skill is needed. The actual saving depends on the number and size of
   installed skills and on the host implementation.

Willison's analysis of a Slack GIF creator skill demonstrates another useful
feature: procedural guidance can sit beside tested helper code and validation.
That can be more reliable than asking a model to recreate every operation from
prose.

## How to Use Skills

Availability and interfaces change, so Anthropic's current documentation should
be treated as the source of truth. At launch, the main patterns were:

1. **Pre-built skills**: Capabilities supplied by the product, including
   document creation
2. **Custom skills**: User-authored folders for domain-specific workflows

In the normal flow, the user asks for a task and the assistant identifies a
relevant skill from its description. Clear descriptions therefore matter: they
affect whether the right instructions are discovered at the right time.

## Applications

Real-world applications include:

1. **Document processing**: Create and modify spreadsheets, presentations and
   PDFs
2. **Data analysis**: Apply repeatable calculations and visualisations with
   specialised techniques
3. **Workflow automation**:
   [A company reports](https://www.anthropic.com/news/skills) an 83% time
   reduction on a specialised task

The reported time saving is a vendor case study, not a general performance
guarantee. The broader idea is more durable: keep reusable expertise
inspectable, load it when relevant, and pair prose with deterministic tools
where possible. Skills still require maintenance, security review and evaluation
against real tasks.

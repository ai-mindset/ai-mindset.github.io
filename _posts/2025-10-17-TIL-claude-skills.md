---
layout: post
title: "💡 TIL: Claude Skills - Modular AI Capabilities with Minimal Token Cost"
date: 2025-10-17
tags: [til, ai, claude, llm, productivity]
---

**TL;DR:** Claude Skills are modular instruction sets that extend Claude's capabilities for specialised tasks with minimal token overhead. They load dynamically when needed, include executable code, and work across Claude's interfaces. Skills use YAML frontmatter summaries that consume only dozens of tokens while keeping full implementations ready when relevant—enabling tasks from document creation to financial analysis whilst maintaining model performance.
<!--more-->

## Introduction

As AI assistants become integrated into professional workflows, their ability to handle specialised tasks effectively becomes crucial. [Anthropic's Claude Skills](https://www.anthropic.com/news/skills) represent a significant advancement in extending AI capabilities without compromising performance or security.

## What Are Claude Skills?

Claude Skills are folders containing instructions, scripts, and resources that enable Claude to perform specialised tasks efficiently. Rather than loading all capabilities simultaneously, Claude scans available skills and loads only necessary components when relevant.

Key characteristics:

- **Composable**: Multiple skills work together automatically
- **Portable**: Same format works across Claude applications, Claude Code, and API
- **Efficient**: Uses YAML frontmatter summaries in Markdown files consuming only dozens of tokens
- **Powerful**: Can include executable code for reliable task execution

## Technical Implementation

Claude Skills use a remarkably efficient implementation approach:

1. Skills include YAML frontmatter summaries in Markdown files (~dozens of tokens) [as described by Simon Willison](https://simonwillison.net/2025/Oct/16/claude-skills/)
2. Claude scans these summaries during task execution
3. Full skill details load only when relevant to the current task
4. Code execution happens in a secure environment

This approach dramatically reduces token overhead compared to alternatives like Model Context Protocol, which [as Simon Willison noted](https://simonwillison.net/2025/Oct/16/claude-skills/), "famously consumes tens of thousands of tokens".

Willison's analysis of a Slack GIF creator skill shows that skills can import helper modules (like `GIFBuilder`), use validation functions (e.g., `check_slack_size()`), and save outputs to designated locations such as `/mnt/user-data/outputs/`.

## How to Use Skills

Currently, skills are available to Pro, Max, Team, and Enterprise users on Claude.ai:

1. **Pre-built Skills**: Document creation (Excel, PowerPoint, Word, PDFs)
2. **Custom Skills**: Developers can create these via the `/v1/skills` API endpoint

Using a skill requires simply asking Claude to perform a task in the skill's domain—Claude will identify and load the relevant skill automatically. For example, asking "Create an Excel spreadsheet with my Q3 sales data" would trigger Claude to load its Excel skill capabilities without requiring explicit skill activation.

## Applications

Real-world applications include:

1. **Document Processing**
   - Create and modify Excel spreadsheets, PowerPoint presentations, PDFs
   - Format documents according to specific guidelines

2. **Data Analysis**
   - Perform financial calculations and visualisations
   - Process complex datasets with specialized techniques

3. **Workflow Automation**
   - [Companies report](https://www.anthropic.com/news/skills) 83% time reduction on specialised tasks
   - Brand guideline compliance and business process streamlining

## Conclusion

Claude Skills represent an important evolution in AI assistant capabilities, enabling specialised task performance with minimal token overhead. By summarising capabilities in YAML frontmatter within Markdown files and loading full implementations only when needed, skills maintain Claude's core performance while significantly extending its capabilities across interfaces and applications.
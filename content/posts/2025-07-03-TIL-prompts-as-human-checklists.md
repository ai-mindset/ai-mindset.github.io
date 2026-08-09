---
layout: post
title: "💡 TIL: Engineering Prompts Double as Human Checklists"
date: 2025-07-03
tags: [
  ai,
  best-practices,
  prompt-engineering,
  system-prompts,
  code-quality,
  productivity,
  til,
  debugging,
]
---

**TL;DR:** A well-crafted system prompt can double as process documentation.
Reading the prompts in Microsoft's VS Code Copilot Chat repository reminded me
that instructions written for an assistant can expose useful checks for humans
too.

<!--more-->

## Introduction

I was exploring Microsoft's recently open-sourced
[VSCode Copilot Chat extension](https://github.com/microsoft/vscode-copilot-chat/)
codebase when I noticed something interesting: the prompts that power AI coding
assistants make excellent checklists for human developers too.

## Engineering Prompts as Process Documentation

At the time I first explored the repository, one agent instruction file
contained a detailed debugging sequence. The implementation has since moved,
which is a useful reminder not to confuse a changing prompt with a permanent
standard. The sequence included ideas such as:

1. Initialize Git and explore the repository structure
2. Create a reproduction script to confirm the issue
3. Execute the script to document the exact error
4. Analyse the root cause
5. Read relevant code blocks before making changes
6. Develop comprehensive test cases
7. Preserve a recoverable baseline before editing
8. Apply and verify fixes iteratively

These are not universal rules. Creating a reproduction is usually valuable;
staging every file before an edit is workflow-dependent. The value comes from
making the reasoning explicit enough to inspect and adapt.

Another prompt template in that repository snapshot was equally instructive. It
emphasised context analysis, consistency and understanding developer intent
before suggesting changes. I have left the repository link at the top rather
than a brittle line-level link to a file that has since moved.

Prompts can therefore be more than instructions for an AI: they can be
reviewable records of a team's assumptions and process. The relationship is not
automatic, however. A long or effective prompt may still encode brittle
practices. It deserves the same review as any other operational documentation.

## Conclusion

When debugging a difficult issue or refactoring complex code, it can be useful
to read the assistant's instructions as a checklist for yourself. Keep the steps
that improve observation and verification, and discard those that exist only to
work around a model's limitations.

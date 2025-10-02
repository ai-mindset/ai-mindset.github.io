---
layout: post
title: "💡 TIL: Engineering Prompts Double as Human Checklists"
date: 2025-07-03
tags: [ai, best-practices, prompt-engineering, system-prompts, code-quality, productivity, til, debugging]
---

**TL;DR:** Well-crafted AI system prompts, like those in Microsoft's VSCode
Copilot Chat extension, serve as excellent process documentation and
step-by-step checklists that human developers can follow to improve their own
workflows and debugging methodologies.
<!--more-->

## Introduction

I was exploring Microsoft's recently open-sourced
[VSCode Copilot Chat extension](https://github.com/microsoft/vscode-copilot-chat/)
codebase when I noticed something interesting: the prompts that power AI coding
assistants make excellent checklists for human developers too.

## Engineering Prompts as Process Documentation

Take this
[agent instruction prompt](https://github.com/microsoft/vscode-copilot-chat/blob/main/src/extension/prompts/node/agent/agentInstructions.tsx#L197)
for example; it's essentially a 24-step debugging methodology distilled from
countless hours of human engineering experience:

1. Initialize Git and explore the repository structure
2. Create a reproduction script to confirm the issue
3. Execute the script to document the exact error
4. Analyse the root cause
5. Read relevant code blocks before making changes
6. Develop comprehensive test cases
7. Stage files in Git before editing
8. Apply fixes iteratively...

And so on. Each step represents a best practice that seasoned developers follow
instinctively.

The
[system prompt template](https://github.com/microsoft/vscode-copilot-chat/blob/40d039d8e08c2d17435a2e65846120c394d0727b/src/extension/xtab/common/promptCrafting.ts#L34)
is equally instructive. It emphasises context analysis, consistency, and
understanding developer intent before suggesting changes.

What's brilliant is that these prompts aren't just instructions for AI, they're
codified human expertise. When we craft prompts for AI systems, we're
essentially documenting our own thought processes and best practices. The better
the prompt, the better the human process it represents.

## Conclusion

Next time you're debugging a tricky issue or refactoring complex code, consider
following the same systematic approach these AI prompts encourage. After all,
good prompts are just good processes made explicit.

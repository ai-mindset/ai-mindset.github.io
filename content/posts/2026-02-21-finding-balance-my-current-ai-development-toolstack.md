---
layout: post
title: "🛠️ Finding Balance: My Current AI Development Toolstack"
date: 2026-02-21
tags: [
  toolchain,
  ai,
  productivity,
  minimal,
  claude,
  github-copilot,
  lumo,
  solve-it,
  mistral,
]
---

**TL;DR:** As of February 2026, I use Claude Code for repository-scale work,
Solveit for deliberate learning, Lumo for privacy-conscious conversations, and
GitHub Copilot occasionally. This is a personal snapshot, not a timeless
ranking: prices, model capabilities and product terms change too quickly for
that.

<!--more-->

## Introduction

Over the past year, I've experimented with several AI development tools. My goal
has been to find a compact toolset that supports both delivery and learning
without accumulating unnecessary subscriptions. The useful question is not which
assistant is universally best, but which trade-offs suit a particular task.

## My Current Toolstack

### Claude Code (Used Daily)

Claude Code has become my primary workhorse for several key tasks:

- **Codebase exploration**: Navigating unfamiliar repositories and understanding
  other developers' code
- **Multi-file fixes**: Making coordinated changes across multiple files
- **Code documentation**: Generating comprehensive documentation for existing
  code
- **Article drafting**: Creating initial outlines like this one before manual
  refinement

Claude Code handles complex requirements and large codebases well, but
delegation can also reduce my sense of control. It sometimes produces more code
or prose than I would choose, so review and simplification remain part of the
job.

The subscription cost has also made me consider local open-weight models. That
is a total-cost-of-ownership decision rather than a simple
subscription-versus-hardware comparison. Purchase price, memory capacity,
measured performance on my own tasks, electricity, maintenance and resale value
all matter. Model progress is too irregular to justify buying hardware on the
assumption that it will match a particular hosted model within a fixed number of
months.

### GitHub Copilot (Used Occasionally)

Copilot occupies an interesting position in my workflow:

- **Inline code suggestions**: Useful for repetitive patterns and common
  operations
- **GitHub Actions workflows**: Strong at suggesting CI/CD configurations
- **Documentation generation**: Reasonable at generating docstrings, doctests
  and comments

However, I've found Copilot frequently gets in my way, offering suggestions when
I don't need them and sometimes requiring more effort to correct than to write
from scratch. Of all my current tools, Copilot provides the least unique value
given its overlap with other assistants.

### Proton's Lumo (Used Occasionally)

Lumo has become a useful assistant for conversations where privacy is an
important consideration:

- **Refining ideas**: Excellent conversational partner for brainstorming and
  iteration
- **Small code snippets**: Generates concise, practical solutions without
  overengineering
- **ChatGPT alternative**: A smooth, privacy-focused chat interface

[Proton says](https://proton.me/lumo/ai/security) Lumo keeps no chat logs and
uses zero-access encryption for saved conversations. Those are meaningful
product claims, but I still avoid treating any hosted assistant as a suitable
place for secrets without first checking its current terms and threat model.

I'm looking forward to the potential of Proton releasing an API for Lumo, which
might eventually allow it to serve as a replacement for other AI services in
some contexts. However, there's no guarantee this will happen as the company may
have different plans for its development.

### Solveit (Used Daily)

I'm still exploring Solveit's capabilities:

- **Literate programming**: Integrates documentation and code development
  seamlessly
- **Learning new domains**: Particularly strong for building Python projects
  from scratch
- **Book chapter writing**: Structured approach to technical content creation
- **Close reading**: Deep dive into research papers, books, blog posts

What makes Solveit distinctive is its methodical approach, influenced by George
Polya's 1945 book _How to Solve It_. Instead of generating large blocks of code,
Solveit encourages building solutions incrementally, often one or two lines at a
time, while maintaining human agency throughout the process.

Unlike Claude Code's automated approach where the agentic AI takes control,
Solveit keeps me firmly in the driver's seat whilst still providing AI
assistance. This results in deeper understanding and learning, albeit at the
cost of development speed. The platform's design as a "dialogue engineering"
environment rather than just a code generator helps avoid the cognitive debt
that can accumulate when over-relying on AI-generated content.

I'm actively evaluating whether Solveit could become my primary IDE for
production code contributions, though its design scope may not fully extend to
this use case yet.

### Mistral Vibe (Evaluated)

I evaluated Mistral's agentic AI CLI tool Mistral Vibe with Devstral-2 123B via
API. The generous Le Chat Pro usage limits were welcome compared to Claude Pro's
increasingly restrictive quotas.

Mistral Vibe follows a similar approach to Claude Code, providing an agentic
interface for coding tasks. The tool handled basic operations competently and
showed decent understanding of project context. In this evaluation, Devstral-2
was less effective than the Claude models I was using in several areas:

- **Code quality**: Generated solutions were functional but less elegant
- **Context understanding**: Struggled with complex multi-file relationships
- **Problem solving**: Required more iterations to reach satisfactory solutions

While the cost advantages are compelling, the capability gap made it unsuitable
as a primary replacement for Claude Code in my workflow.

## Finding the Optimal Balance

After several months of experimentation, I've concluded that GitHub Copilot is
the weakest link in my current stack. While I've got an annual subscription,
I'll limit its use to GitHub Actions and smaller GitHub issues.

My evaluation of Mistral Vibe reinforced this assessment. Despite generous usage
limits, it required more intervention on my tasks and was not a suitable primary
replacement at that point. A later model or a different benchmark set could
produce a different result.

Rather than seeking an assortment of tools, I've found that each tool serves a
distinct purpose with its own strengths and trade-offs:

| Task                            | Current Best Tool | Key Trade-off                         |
| ------------------------------- | ----------------- | ------------------------------------- |
| Codebase exploration            | Claude Code       | Sacrifices user control to agentic AI |
| Multi-file changes              | Claude Code       | May overcomplicate solutions          |
| Chat interface/brainstorming    | Lumo              | Limited code integration              |
| Privacy-focused interactions    | Lumo              | No API access (yet?)                  |
| Deep learning/controlled coding | Solveit           | Slower development pace               |
| GitHub specific tasks           | GitHub Copilot    | Limited unique value                  |
| Production coding               | Still evaluating  | Control vs. speed                     |

The bigger question may be sustainability. A high monthly subscription can
eventually exceed the cost of local hardware, but the two options do not provide
the same service. Before buying a machine, I would test representative workloads
and compare output quality, latency, privacy, power consumption and the value of
my maintenance time.

I'm looking for a minimal, compact toolbox that covers my computational and
learning requirements whilst remaining cost-effective as the AI landscape
evolves.

## The Path Forward

Each tool occupies a different niche in my workflow:

1. **Claude Code** for tasks where I need to understand large codebases or make
   coordinated changes across multiple files, accepting some loss of control to
   agentic AI
2. **Lumo** for conversational interactions where privacy is paramount,
   especially when brainstorming sensitive topics
3. **Solveit** for deeper learning experiences and maintaining complete control
   of the code creation process
4. **GitHub Copilot** for GitHub-specific tasks until my subscription expires

Unlike my initial assumption that tools would complement each other, I've
discovered they serve different use cases with distinct trade-offs between
control, privacy, speed, and depth of understanding.

## Conclusion

The key insight from this exploration is that AI tools present distinct
trade-offs rather than forming a seamless ecosystem. Claude Code's automation,
Lumo's privacy positioning, Solveit's methodical workflow and Copilot's GitHub
integration each exchange some combination of control, speed, cost and depth.

My goal is to narrow down to two tools that best address my needs, reducing both
subscription costs and cognitive overhead. The challenge isn't finding perfect
complementarity, but identifying which specific trade-offs I'm willing to accept
for different types of work as the AI landscape continues evolving. Currently
the combination of Claude Code and Solveit seems to strike the best balance for
my needs.

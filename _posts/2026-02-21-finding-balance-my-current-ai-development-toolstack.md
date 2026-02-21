---
layout: post
title: "🛠️ Finding Balance: My Current AI Development Toolstack"
date: 2026-02-21
tags: [toolchain, ai, productivity, minimal, claude, github-copilot, lumo, solve-it, mistral]
---

**TL;DR:** After experimenting with various AI coding assistants including Mistral Vibe, I've discovered that each serves a distinct purpose rather than forming a complementary set. Claude Code excels at codebase exploration but sacrifices user control, Solve It offers deep understanding at the cost of speed, Lumo provides a superior privacy-focused chat interface, whilst GitHub Copilot remains the weakest link. Rising subscription costs make hardware investments like AMD Strix Halo increasingly attractive for running open-weight models.

<!--more-->

## Introduction

Over the past year, I've experimented with multiple AI development tools, each with unique strengths and weaknesses. My goal has been to find a minimal, effective toolstack that covers all my needs whilst reducing subscription costs. What I've discovered is that each tool excels in specific domains rather than forming a truly complementary ecosystem.

## My Current Toolstack

### Claude Code (Used Daily)

Claude Code has become my primary workhorse for several key tasks:

- **Codebase exploration**: Navigating unfamiliar repositories and understanding other developers' code
- **Multi-file fixes**: Making coordinated changes across multiple files
- **Code documentation**: Generating comprehensive documentation for existing code
- **Article drafting**: Creating initial outlines like this one before manual refinement

While Claude Code excels at understanding complex requirements and handling large codebases, its primary limitation is a lack of user control. The agentic AI takes charge of the coding process, often overcomplicating both code and text. I find myself regularly simplifying its output to match my preference for minimalist solutions.

Claude Max at $200/month feels steep when a capable miniPC running open-weight models - likely approaching Sonnet capability within 3-6 months - costs similar money upfront. Open-weight models typically lag frontier models by six months, yet accelerated releases from Chinese research groups suggest this gap may narrow. An AMD Strix Halo system might prove worthwhile for experimenting with powerful open-weight models rather than maintaining expensive subscriptions.[^1]

[^1]: At ~140W power consumption, even running 24/7, electricity costs remain manageable compared to subscription fees.

```python
# Claude Code's approach: comprehensive but overcomplicated
def process_data(input_data, config=None):
    """Process input data according to configuration.

    Args:
        input_data (dict): The input data to process
        config (dict, optional): Configuration options

    Returns:
        dict: Processed data with applied transformations
    """
    config = config or {}
    result = {}

    # Validate input
    if not isinstance(input_data, dict):
        raise TypeError("Input data must be a dictionary")

    # Apply transformations based on config
    for key, value in input_data.items():
        if key in config.get('exclude_fields', []):
            continue
        if key in config.get('transform_fields', {}):
            transform_func = config['transform_fields'][key]
            result[key] = transform_func(value)
        else:
            result[key] = value

    return result

# My simplified version for the same task
def process_data(data, config={}):
    return {k: config.get('transforms', {}).get(k, lambda x: x)(v)
            for k, v in data.items() if k not in config.get('exclude', [])}
```

### GitHub Copilot (Used Occasionally)

Copilot occupies an interesting position in my workflow:

- **Inline code suggestions**: Useful for repetitive patterns and common operations
- **GitHub Actions workflows**: Strong at suggesting CI/CD configurations
- **Documentation generation**: Reasonable at generating docstrings, doctests and comments

However, I've found Copilot frequently gets in my way, offering suggestions when I don't need them and sometimes requiring more effort to correct than to write from scratch. Of all my current tools, Copilot provides the least unique value given its overlap with other assistants.

### Proton's Lumo (Used Frequently)

Lumo has become an essential part of my daily workflow:

- **Refining ideas**: Excellent conversational partner for brainstorming and iteration
- **Small code snippets**: Generates concise, practical solutions without overengineering
- **ChatGPT alternative**: A smooth, privacy-focused chat interface

What sets Lumo apart is Proton's commitment to privacy. Unlike many AI tools, Lumo operates with a strict no-logs policy and zero-access encryption, ensuring conversations remain confidential. My data isn't used to train models, and the entire system is open-source for transparency.

I'm looking forward to the potential of Proton releasing an API for Lumo, which might eventually allow it to serve as a replacement for other AI services like Claude in some contexts. However, there's no guarantee this will happen as the company may have different plans for its development.

### Solve It (Used Daily)

I'm still exploring Solve It's capabilities:

- **Literate programming**: Integrates documentation and code development seamlessly
- **Learning new domains**: Particularly strong for building Python projects from scratch
- **Book chapter writing**: Structured approach to technical content creation
- **Close reading**: Deep dive into research papers, books, blog posts

What makes Solve It distinctive is its methodical approach based on George Polya's classic problem-solving framework from his 1945 book "How to Solve It". Instead of generating large blocks of code, Solve It encourages building solutions incrementally - typically one or two lines at a time - maintaining human agency throughout the process.

Unlike Claude Code's automated approach where the agentic AI takes control, Solve It keeps me firmly in the driver's seat whilst still providing AI assistance. This results in deeper understanding and learning, albeit at the cost of development speed. The platform's design as a "dialogue engineering" environment rather than just a code generator helps avoid the cognitive debt that can accumulate when over-relying on AI-generated content.

I'm actively evaluating whether Solve It could become my primary IDE for production code contributions, though its design scope may not fully extend to this use case yet.

### Mistral Vibe (Evaluated)

I evaluated Mistral's agentic AI CLI tool with Devstral-2 123B via API. The generous Le Chat Pro usage limits were welcome compared to Claude Pro's increasingly restrictive quotas.

Mistral Vibe follows a similar approach to Claude Code - providing an agentic AI interface for coding tasks. The tool handled basic operations competently and showed decent understanding of project context. However, Devstral-2 feels noticeably weaker than Claude Sonnet and Opus in several key areas:

- **Code quality**: Generated solutions were functional but less elegant
- **Context understanding**: Struggled with complex multi-file relationships
- **Problem solving**: Required more iterations to reach satisfactory solutions

While the cost advantages are compelling, the capability gap made it unsuitable as a primary replacement for Claude Code in my workflow.

## Finding the Optimal Balance

After several months of experimentation, I've concluded that GitHub Copilot is the weakest link in my current stack. While I've paid for an annual subscription, I'll limit its use to GitHub Actions and smaller GitHub issues.

My evaluation of Mistral Vibe reinforced this assessment - despite generous usage limits, Devstral-2's capabilities lag noticeably behind Claude's models, making it unsuitable as a primary replacement despite potential cost savings.

Rather than seeking an assortment of tools, I've found that each tool serves a distinct purpose with its own strengths and trade-offs:

| Task | Current Best Tool | Key Trade-off |
|------|-------------------|---------------|
| Codebase exploration | Claude Code | Sacrifices user control to agentic AI |
| Multi-file changes | Claude Code | May overcomplicate solutions |
| Chat interface/brainstorming | Lumo | Limited code integration |
| Privacy-focused interactions | Lumo | No API access (yet?) |
| Deep learning/controlled coding | Solve It | Slower development pace |
| GitHub specific tasks | GitHub Copilot | Limited unique value |
| Production coding | Still evaluating | Control vs. speed |

The bigger question may be sustainability. Claude Max's $200/month cost competes directly with hardware investments like an AMD Strix Halo system that could run increasingly capable open-weight models. If open-weight models continue closing the gap with frontier models - potentially within 3-6 months - local hardware might offer better long-term value than subscription services.

I'm looking for a minimal, compact toolbox that covers my computational and learning requirements whilst remaining cost-effective as the AI landscape evolves.

## The Path Forward

Each tool occupies a different niche in my workflow:

1. **Claude Code** for tasks where I need to understand large codebases or make coordinated changes across multiple files, accepting some loss of control to agentic AI
2. **Lumo** for conversational interactions where privacy is paramount, especially when brainstorming sensitive topics
3. **Solve It** for deeper learning experiences and maintaining complete control of the code creation process
4. **GitHub Copilot** for GitHub-specific tasks until my subscription expires

Unlike my initial assumption that tools would complement each other, I've discovered they serve different use cases with distinct trade-offs between control, privacy, speed, and depth of understanding.

## Conclusion

The key insight from this exploration is that AI tools present distinct trade-offs rather than forming a complementary ecosystem. Each tool - Claude Code's agentic automation, Lumo's privacy-focused chat, Solve It's methodical learning approach, and Copilot's GitHub integration - serves specific use cases with inherent compromises between control, privacy, speed, and depth.

My goal is to narrow down to two tools that best address my needs, reducing both subscription costs and cognitive overhead. The challenge isn't finding perfect complementarity, but identifying which specific trade-offs I'm willing to accept for different types of work as the AI landscape continues evolving.


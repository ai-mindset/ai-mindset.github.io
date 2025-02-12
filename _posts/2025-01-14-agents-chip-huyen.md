---
layout: post
title: "🤖 Understanding AI Agents: Tools, Planning, and Evaluation"
date: 2025-01-14
tags: [ai, llm, prompt-engineering, system-prompts, evaluation, best-practices, toolchain, machine-learning]
---
<!--more-->

## Introduction
This article summarises Chip Huyen's comprehensive blog post "[Agents](https://huyenchip.com//2025/01/07/agents.html)" adapted from her upcoming book AI Engineering (2025). The original piece provides an in-depth examination of intelligent agents, which represent a fundamental concept in AI, defined by Russell and Norvig in their seminal 1995 book [Artificial Intelligence: A Modern Approach](https://en.wikipedia.org/wiki/Artificial_Intelligence:_A_Modern_Approach) as anything that can perceive its environment through sensors and act upon it through actuators. Huyen explores how the unprecedented capabilities of foundational models have transformed theoretical possibilities into practical applications, enabling agents to operate in diverse environments -from digital workspaces for coding to physical settings for robotics. These agents can now assist with tasks ranging from website creation to complex negotiations.

## Understanding Agents and Their Tools
An agent's effectiveness is determined by two key factors: its environment and its tool inventory. The environment defines the scope of possible actions, while tools enable the agent to perceive and act within this environment. Modern agents leverage three distinct categories of tools.  
Knowledge augmentation tools, including text retrievers and web browsing capabilities, prevent model staleness by enabling access to current information. However, web browsing tools require careful API selection to protect against unreliable or harmful content. Capability extension tools address inherent model limitations -for instance, providing calculators for precise arithmetic or code interpreters for programming tasks. These interpreters demand robust security measures to prevent code injection attacks.  
Write actions represent the most powerful and potentially risky category, enabling agents to modify databases or send emails. These tools are distinguished from read-only actions by their ability to affect the environment directly. The [Chameleon](https://arxiv.org/abs/2304.09842) system demonstrated the power of tool augmentation, achieving an 11.37% improvement on ScienceQA (a science question answering task) and 17% on TabMWP (a tabular math problem-solving task) through strategic tool combination.

<center>
    <figure>
           <a href="https://huyenchip.com//2025/01/07/agents.html"><img src="https://huyenchip.com/assets/pics/agents/8-tool-transition.png" width="80%" height="80%"/></a>
        <figcaption>A tool transition tree by Chameleon</figcaption>
    </figure>
</center>


## Planning and Execution Strategies
Effective planning requires balancing granularity and flexibility. While [Toolformer](https://arxiv.org/abs/2302.04761) managed with 5 tools and [Chameleon](https://arxiv.org/abs/2304.09842) with 13, [Gorilla](https://arxiv.org/abs/2305.15334) attempted to handle 1,645 APIs, illustrating the complexity of tool selection. Plans can be expressed either in natural language or specific function calls, each approach offering different advantages in maintainability and precision.  
Foundational Model planners require minimal training but need careful prompting, while Reinforcement Learning planners demand extensive training for robustness. Modern planning systems support multiple control flows: sequential, parallel, conditional, and iterative patterns. The [ReAct](https://arxiv.org/abs/2210.03629) framework successfully combines reasoning with action, 
<center>
    <figure>
        <a href="https://huyenchip.com//2025/01/07/agents.html"><img src="https://huyenchip.com/assets/pics/agents/5-ReAct.png" width="80%" height="80%"/></a>
        <figcaption>ReAct agent</figcaption>
    </figure>
</center>


while [Reflexion](https://arxiv.org/abs/2303.11366) separates evaluation and self-reflection for improved performance.
<center>
    <figure>
        <a href="https://huyenchip.com//2025/01/07/agents.html"><img src="https://huyenchip.com/assets/pics/agents/6-reflexion.png" width="80%" height="80%"/></a>
        <figcaption>Reflexion agent</figcaption>
    </figure>
</center>

## Reflection and Error Management
Continuous reflection and error correction form the backbone of reliable agent systems. The process begins with query validation, continues through plan assessment, and extends to execution monitoring. Chameleon's tool transition analysis shows how tools are commonly used together, while Voyager's skill manager builds on this by tracking and reusing successful tool combinations.

## Evaluation Framework
Agent evaluation requires a comprehensive approach to failure mode analysis. Planning failures might involve invalid tools or incorrect parameters, while tool-specific failures demand targeted analysis. Efficiency metrics must consider not just step count and costs, but also completion time constraints. When comparing AI and human agents, it's essential to recognise their different operational patterns -what's efficient for one may be inefficient for the other. Working with domain experts helps identify missing tools and validate performance metrics.

## Conclusion
Huyen's analysis demonstrates that successful AI agents emerge from the careful orchestration of three key elements: strategic tool selection, sophisticated planning mechanisms, and robust evaluation frameworks. While tools dramatically enhance agent capabilities -as evidenced by Chameleon's significant performance improvements- their effectiveness depends on thoughtful curation, balancing between Toolformer's minimal approach and Gorilla's extensive API integration. The integration of planning frameworks like ReAct and Reflexion shows how combining reasoning with action and incorporating systematic reflection can enhance agent performance. However, as an emerging field without established theoretical frameworks, significant challenges remain in tool selection, planning efficiency, and error management. Future developments will focus on agent framework evaluation and memory systems for handling information beyond context limits, while maintaining the delicate balance between capability and control that Huyen emphasizes throughout her analysis.


---
layout: post
title: "💡 TIL: LLM Evaluation using Critique Shadowing"
date: 2024-12-05
tags: [til, llm, ai, machine-learning, mlops, best-practices, production, model-governance, evaluation, observability, monitoring, quality-assurance, iterative-refinement]
---

**TL;DR:** Critique Shadowing offers an expert-centered approach to LLM evaluation by starting with binary pass/fail judgments and detailed critiques before building automated systems. This iterative methodology—reminiscent of 1970s knowledge engineering—prioritizes domain expertise over complex metrics, revealing valuable insights about products and users while developing reliable evaluation systems that capture nuanced quality standards. 
<!--more-->

## Introduction
As LLMs increasingly drive critical business decisions, ensuring their reliability becomes paramount. Many teams struggle with complex metrics and scoring systems that lead to confusion rather than clarity. [Hamel Husain](https://hamel.dev/)'s Critique Shadowing methodology[^1] offers a systematic path from drowning in metrics to developing reliable evaluation systems.

## The Critique Shadowing Method
The key insight behind Critique Shadowing is deceptively simple: start with binary (pass/fail) expert judgements and detailed critiques before building automated evaluation systems. This approach solves two critical challenges: capturing domain expertise and scaling evaluation processes.

This expert-centric approach echoes [knowledge engineering](https://en.wikipedia.org/wiki/Knowledge_engineering) practices from the 1970-80s, when AI researchers first recognised the necessity of systematically capturing domain expertise. Just as [MYCIN](https://en.wikipedia.org/wiki/Mycin)'s creators worked closely with medical doctors to encode diagnostic knowledge, Critique Shadowing similarly structures the process of extracting expert judgement for LLM evaluation. While the technology has evolved from rule-based systems to large language models, the fundamental challenge of effectively capturing and operationalising expert knowledge remains central.

### Implementation Process
The methodology follows a structured, iterative process:

<center>
    <img src="https://raw.githubusercontent.com/ai-mindset/ai-mindset.github.io/refs/heads/master/images/Critique%20Framework%20Hamel%20Husain.png" width="80%" height="80%"/>
</center>

1. Identify a principal domain expert as the arbiter of quality
2. Create a diverse dataset covering different scenarios and user types
3. Expert conducts binary pass/fail judgements with detailed critiques
4. Address discovered issues and verify fixes
5. Develop LLM-based judges using expert critiques as few-shot examples
6. Analyse error patterns and root causes
7. Create specialised judges for persistent issues

The process is continuous, repeating periodically or when material changes occur. For simpler applications or when manual review is feasible, teams can adapt or streamline these steps while maintaining the core principle of systematic data examination.

## Beyond Automation
Husain's most striking observation is that the process of developing evaluation systems often provides more value than the resulting automated judges. The systematic collection of expert feedback reveals product insights, user needs, and failure modes that might otherwise remain hidden. This understanding drives improvements in the core system, not just its evaluation.

## Conclusion
The Critique Shadowing methodology succeeds by prioritising expert knowledge and systematic data collection over premature automation. For teams building LLM applications, this approach offers a clear path to reliable evaluation systems while simultaneously deepening their understanding of their product and users.  
LLM evaluation is an active area of interest and research both in academia and industry. Here is a short list of resources to look into: 
- [IBM LLM Evaluation](https://www.ibm.com/think/topics/llm-evaluation)
- [Mistral AI - Evaluation](https://docs.mistral.ai/guides/evaluation/)
- [Mistral Evals](https://github.com/mistralai/mistral-evals)
- [Anthropic - Using the Evaluation Tool](https://docs.anthropic.com/en/docs/test-and-evaluate/eval-tool)
- [Top 5 Open-Source LLM Evaluation Frameworks in 2024](https://dev.to/guybuildingai/-top-5-open-source-llm-evaluation-frameworks-in-2024-98m)

---
[^1]: Husain, H. (2024). "Creating a LLM-as-a-Judge That Drives Business Results" https://hamel.dev/blog/posts/llm-judge/

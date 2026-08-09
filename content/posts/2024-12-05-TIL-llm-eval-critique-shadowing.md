---
layout: post
title: "💡 TIL: LLM Evaluation using Critique Shadowing"
date: 2024-12-05
tags: [
  til,
  llm,
  ai,
  machine-learning,
  mlops,
  best-practices,
  production,
  model-governance,
  evaluation,
  observability,
  monitoring,
  quality-assurance,
  iterative-refinement,
]
---

**TL;DR:** Critique Shadowing starts with a domain expert making pass/fail
judgements and writing detailed critiques. Those examples can expose product
failures and later help build an LLM judge. It is a practical starting method,
not proof that binary labels or automated judges suit every evaluation problem.

<!--more-->

## Introduction

Evaluating an LLM application requires a definition of acceptable behaviour and
examples that test it. Teams can collect elaborate metrics before they have
agreed what quality means. [Hamel Husain](https://hamel.dev/)'s Critique
Shadowing methodology[^1] offers one way to start with the people and failures
that matter.

## The Critique Shadowing Method

The key insight behind Critique Shadowing is deceptively simple: start with
binary (pass/fail) expert judgements and detailed critiques before building
automated evaluation systems. This approach solves two critical challenges:
capturing domain expertise and scaling evaluation processes.

This expert-centred approach echoes
[knowledge engineering](https://en.wikipedia.org/wiki/Knowledge_engineering)
practices from the 1970s and 1980s, when AI researchers worked to capture domain
expertise systematically. Just as [MYCIN](https://en.wikipedia.org/wiki/Mycin)'s
creators worked with medical specialists to encode diagnostic knowledge,
Critique Shadowing structures the elicitation of expert judgement for LLM
evaluation. The analogy has limits, but the problem of turning tacit quality
standards into inspectable criteria remains relevant.

### Implementation Process

The methodology follows a structured, iterative process:

<center>
    <img src="/images/Critique%20Framework%20Hamel%20Husain.png" width="80%" alt="Hamel Husain's critique framework" />
</center>

1. Identify a principal domain expert as the arbiter of quality
2. Create a diverse dataset covering different scenarios and user types
3. Expert conducts binary pass/fail judgements with detailed critiques
4. Address discovered issues and verify fixes
5. Develop LLM-based judges using expert critiques as few-shot examples
6. Analyse error patterns and root causes
7. Create specialised judges for persistent issues

The process is continuous, repeating periodically or when material changes
occur. For simpler applications or when manual review is feasible, teams can
adapt or streamline these steps while maintaining the core principle of
systematic data examination.

## Beyond Automation

Husain's most striking observation is that the process of developing evaluation
systems often provides more value than the resulting automated judges. The
systematic collection of expert feedback reveals product insights, user needs,
and failure modes that might otherwise remain hidden. This understanding drives
improvements in the core system, not just its evaluation.

## Conclusion

The Critique Shadowing methodology succeeds by prioritising expert knowledge and
systematic data collection over premature automation. For teams building LLM
applications, this approach offers a clear path to reliable evaluation systems
while simultaneously deepening their understanding of their product and users.\
LLM evaluation is an active area of interest and research both in academia and
industry. Here is a short list of resources to look into:

- [IBM LLM Evaluation](https://www.ibm.com/think/topics/llm-evaluation)
- [Mistral AI - Best Practices](https://docs.mistral.ai/models/best-practices)
- [Mistral Evals](https://github.com/mistralai/mistral-evals)
- [Anthropic - Define Success Criteria and Build Evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests)

---

[^1]: Husain, H. (2024).
    [_Using LLM-as-a-Judge for Evaluation: A Complete
    Guide_](https://hamel.dev/blog/posts/llm-judge/).

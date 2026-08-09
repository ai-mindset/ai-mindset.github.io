---
layout: post
title: "🆙 Level Up With Dialogue Engineering"
date: 2024-11-15
tags: [ai, llm, dialogue-engineering, prompt, iterative-refinement, rag]
---

**TL;DR:** Dialogue engineering replaces one-shot prompting with a structured,
multi-turn process. Define the objective, gather and verify information, agree
an outline, work in small sections, and refine the result while retaining human
oversight.

<!--more-->

## Introduction

Dialogue engineering is an iterative approach to working with Large Language
Models (LLMs). Instead of relying on one large prompt, the user develops a
result through a structured, multi-turn conversation. I first encountered the
term through Jeremy Howard[^2][^3], although related ideas have a longer history
in human-computer interaction[^4]. The process can make complex work easier to
inspect because objectives, evidence, structure and revisions are handled
explicitly. A useful overview comes from
[Dialog Engineering: AI as Your Research Assistant](https://medium.com/@fabioc/dialog-engineering-ai-as-your-research-assistant-616a625e9853).\
Below, I'll summarise what I inferred from that article.

## How Dialogue Engineering Works

1. **Set the scenario.** Define the objective, audience, constraints and
   relevant background before asking for an answer.
2. **Gather information.** Ask for a structured inventory of facts, sources and
   uncertainties, then verify the important evidence independently.
3. **Agree an outline.** Break the task into sections with a clear relationship
   to the overall goal.
4. **Generate iteratively.** Work on one section at a time, using specific
   feedback instead of repeatedly requesting a complete rewrite.
5. **Refine the opening and conclusion.** Revisit both after the main content is
   stable so they accurately frame and synthesise the result.

Throughout all steps, I maintain active oversight, check important claims and
provide clear feedback. The approach has improved my productivity while keeping
responsibility for the result with me.

## Practical Applications

Here are areas where I find the approach useful:

- **Research**: Build a source map, identify disagreements and refine a
  literature review section by section.
- **Business analysis**: Separate evidence, assumptions and recommendations in a
  market or strategy report.
- **Recurring reports**: Use a stable outline and validation checklist while
  updating the underlying data.
- **Content creation**: Develop an argument before polishing its language and
  examples.
- **Technical documentation**: Draft from specifications and code, then verify
  every behavioural claim against the implementation.

The common benefit is inspectability: a mistaken source, outline or assumption
can be challenged before it is buried in a polished final answer. Whether the
method is faster depends on the task and the quality of review.

## Best Practices

Key best practices include:

- **Be precise**: State the goal and constraints clearly enough to evaluate the
  answer.
- **Refine iteratively**: Give targeted feedback and preserve good work instead
  of restarting blindly.
- **Verify sources**: Open citations and check that they support the claim being
  made.
- **Structure first**: Agree the shape of a long response before investing in
  polished prose.
- **Manage context**: Keep the relevant evidence in context and divide long work
  into coherent sections.

However, we should be aware of the limitations (and challenges) of Dialogue
Engineering too.

## Understanding the Limitations

Breaking work into turns does not make the model's claims true or its reasoning
reliable. Important limitations remain:

### Key Limitations and Challenges

- A model can repeat a plausible falsehood consistently across several turns.
- Source links may be invented, stale or unrelated to the claim.
- Long conversations can hide earlier assumptions or lose relevant context.
- Sensitive information and unpublished work may not be suitable for a hosted
  service.
- Attribution, authorship and accountability remain with the person publishing
  or acting on the output.

Verification should be proportional to consequence. For technical writing, I run
examples and open primary sources. For medical, legal or financial claims,
relevant qualified review is required; dialogue structure is not a safety
control.

## Conclusion

Dialogue engineering is a useful name for a modest practice: make the objective,
evidence, structure and revision process explicit across several turns. I value
it because smaller decisions are easier to inspect. The improvement comes from
the feedback loop and the human review around it, not from assuming that a
longer conversation gives the model deeper understanding.

---

[^2]: [Answer.ai & AI Magic with Jeremy Howard](https://www.youtube.com/watch?v=qO-YqJm0Q1U&t=16)

[^3]: [How To Solve It With Code](https://www.answer.ai/posts/2024-11-07-solveit.html)

[^4]: _Foundations of dialog engineering: the development of human-computer
    interaction. Part II_
    [(Gaines and Shaw, 1986)](https://gaines.library.uvic.ca/pdf/DevHCI-II-86.pdf)

---
layout: post
title: "📊 Ten Ways to Model Data"
date: 2024-11-27
tags: [
  modelling-mindsets,
  data-science,
  ai,
  data-modeling,
  neural-network,
  best-practices,
  statistics,
  machine-learning,
  decision-making,
]
---

**TL;DR:** Christoph Molnar's modelling mindsets provide different questions to
ask of data: estimation under assumptions, prediction on new cases, causal
effects, latent structure and sequential decisions. These approaches overlap
rather than form a strict taxonomy. T-shaped expertise means learning one area
deeply while knowing enough to recognise when a different question requires a
different method.

<!--more-->

## Introduction

As a practitioner looking to work effectively with real-world data and generate
meaningful insights, I face a crucial decision: which modelling approaches
should I invest my time and energy in learning? After discovering Christoph
Molnar's
[Modeling Mindsets](https://christophmolnar.com/books/modeling-mindsets/), I
realised this isn't about picking the "best" approach. It's about becoming what
he calls a "T-shaped modeller".\
The concept is elegantly simple: rather than trying to master every possible
approach (impossible) or limiting myself to just one (ineffective), I should aim
to develop:

- Deep expertise in one or two mindsets that align with my goals and problems
- Working knowledge of other approaches to recognise when my primary tools
  aren't optimal

This systematic exploration serves two purposes:

1. To understand the landscape: What modelling mindsets are available today, and
   what are their premises, strengths and limitations?
2. To make an informed choice: Which mindsets should I focus on, given my goals
   and constraints?

Each mindset emphasises a different way of approaching problems through data.
The boundaries are porous: causal inference uses statistics, deep learning is
machine learning, and a single system can contain supervised, unsupervised and
decision-making components. By examining these mindsets systematically, I aim to
make an informed decision about where to focus my learning efforts while
maintaining enough breadth to recognise when I should switch approaches. This
isn't just about theoretical understanding, it's about practical effectiveness
in solving real-world problems.

Let's explore each mindset in turn, focusing on their fundamental premises, key
strengths, and limitations to guide this decision.

## Statistical Modelling: The Foundation of Data-Driven Inference

_This mindset sees the world through probability distributions. At its core,
it's about modelling how data is generated and making inferences under
uncertainty._

Key Aspects:

- Uncertain variables can be represented with probability distributions
- Models encode assumptions about how data is generated
- Models are evaluated by checking assumptions and measuring how well they match
  the data
- Statistical workflows distinguish estimation from model checking, although the
  exact evaluation design varies

Primary Strengths:

1. Provides rigorous mathematical framework for handling uncertainty
2. Strong theoretical foundation spanning decades of research
3. Forces explicit consideration of data-generating processes
4. Versatile for decisions, predictions, and understanding

Notable Limitations:

1. Model specification and checking can require substantial judgement
2. Traditional parametric models may struggle with high-dimensional images and
   text
3. Good model fit doesn't guarantee good predictions
4. Less automatable than modern machine learning approaches

This mindset serves as the foundation for three important sub-approaches:
Frequentism, Bayesianism, and Likelihoodism, each with its own interpretation of
probability and evidence. For someone starting in data science, understanding
statistical modelling provides crucial groundwork for understanding both
traditional statistics and modern machine learning approaches.

## Frequentism: Making Decisions Through Repeated Experiments

_Frequentism views probability as long-run frequency and assumes that parameters
in the world are fixed but unknown. It's the dominant approach in many
scientific fields, particularly in medicine and psychology._

Key Aspects:

- Interprets probability as frequency in infinite repetitions
- Makes decisions through hypothesis tests and confidence intervals
- Relies on "imagined experiments" to draw conclusions
- Focuses on estimating fixed, true parameters

Primary Strengths:

1. Provides established procedures for estimation, intervals and tests
2. Computationally fast compared to other approaches
3. Does not require a probability distribution over parameters, although design
   and modelling assumptions still matter
4. Widely accepted in scientific research

Notable Limitations:

1. Often oversimplifies complex questions into yes/no decisions
2. Vulnerable to p-hacking (searching for significant results)
3. Interpretation can be counterintuitive, especially for confidence intervals
4. Results depend on the experimental design, not just the data

For practitioners, Frequentism offers a well-established framework with clear
decision rules and strong scientific acceptance. However, its limitations in
handling uncertainty and tendency toward oversimplification have led to growing
interest in alternative approaches like Bayesian inference.

## Bayesianism: Learning Through Updated Beliefs

_Bayesian inference represents uncertainty about parameters with probability
distributions and updates a prior distribution with observed data under a
model._

Key Aspects:

- Requires prior distributions before seeing data
- Updates beliefs through Bayes' theorem
- Produces posterior distributions conditional on the model and prior
- Can propagate represented sources of uncertainty through later calculations[^1]

Primary Strengths:

1. Can incorporate prior knowledge and expert opinions
2. Provides complete probability distributions for parameters
3. More intuitive interpretation of uncertainty
4. Cleanly separates inference (getting posteriors) from decisions (using them)

Notable Limitations:

1. Choosing priors can be difficult and controversial
2. Computationally intensive, especially for complex models
3. Mathematically more demanding than frequentist approaches
4. Can seem like overkill for simple decisions

Bayesianism offers a more complete and intuitive framework for handling
uncertainty, but requires more computational resources and mathematical
sophistication. It's particularly valuable when prior knowledge is important or
when understanding full uncertainty is crucial.

## Likelihoodism: Pure Evidence Through Likelihood

_Likelihoodism attempts to reform statistical inference by focusing solely on
likelihood as evidence, avoiding both Frequentism's imagined experiments and
Bayesianism's subjective priors._

Key Aspects:

- Uses likelihood ratios to compare hypotheses
- Adheres strictly to the likelihood principle
- Rejects both prior probabilities and sampling distributions
- Compares models based on their relative evidence

Primary Strengths:

1. More coherent than Frequentism's mixed toolkit
2. Avoids subjective elements of Bayesianism
3. Ideas work well within other statistical mindsets
4. Adheres to likelihood principle (evidence depends only on observed data)

Notable Limitations:

1. Cannot make absolute statements, only relative comparisons
2. No clear mechanism for making final decisions
3. Lacks tools for expressing beliefs or uncertainty
4. Less practical than other statistical approaches

Likelihoodism offers interesting theoretical insights but may be less
immediately useful than Frequentist or Bayesian approaches. It's more valuable
for understanding the foundations of statistical inference than for day-to-day
data analysis.

## Causal Inference: From Association to Causation

_Causal inference moves beyond correlation to understand what actually causes
observed effects, providing a framework for analysing interventions and their
impacts._

Key Aspects:

- Uses Directed Acyclic Graphs (DAGs) to visualise relationships
- Distinguishes between association and causation
- Requires explicit encoding of causal assumptions
- Can work with both statistical models and machine learning

Primary Strengths:

1. Addresses fundamental questions about cause and effect
2. Makes assumptions explicit through DAGs
3. Separates questions about interventions from predictive association
4. Provides clear framework for analysing interventions

Notable Limitations:

1. Requires a defensible identification strategy, which may include measuring a
   sufficient adjustment set
2. Cannot verify all causal assumptions from data alone
3. Multiple competing frameworks can confuse newcomers
4. May sacrifice predictive performance for causal understanding

For practitioners, causal inference is essential when decisions about
interventions are needed, though it requires careful consideration of
assumptions and domain knowledge. It's particularly valuable in fields like
medicine, policy-making, and business strategy where understanding cause-effect
relationships is crucial.

## Machine Learning: Algorithms Learning from Data

_Machine learning fits functions or policies from data, often emphasising
performance on a defined task. It draws on statistics, optimisation and computer
science rather than standing outside theory._

Key Aspects:

- Computer-first approach to learning from data
- External evaluation based on task performance
- Can represent complex functions, while still depending on data and modelling
  assumptions
- Includes supervised, unsupervised, reinforcement, and deep learning

Primary Strengths:

1. Task-oriented and pragmatic approach
2. Highly automatable
3. Well-suited for building digital products
4. Strong industry adoption and career opportunities

Notable Limitations:

1. Flexible model classes can make assumptions and failure modes harder to
   inspect
2. Many competing approaches can be overwhelming
3. Models often prioritise performance over interpretability
4. Usually requires substantial data and computation

For practitioners, machine learning offers powerful tools for automation and
prediction, particularly valuable in industry settings. It's especially useful
when theoretical understanding is less important than practical performance.

### Supervised Learning: The Art of Prediction

_Supervised learning frames everything as a prediction problem, using labelled
data to learn mappings from inputs to outputs._

Key Aspects:

- Learning is optimisation and search in hypothesis space
- Models evaluated on unseen data, not training data
- Focuses on generalising to new cases
- Highly automatable and competition-friendly

Primary Strengths:

1. Clear evaluation metrics
2. Highly automatable
3. Strong performance on prediction tasks
4. Well-defined optimisation objectives

Notable Limitations:

1. Requires labelled data
2. Models often black-box (uninterpretable)
3. Not hypothesis-driven
4. May miss causal relationships
5. Can fail in unexpected ways when patterns change

For practitioners, supervised learning excels in prediction tasks where good
labelled data exists and interpretability isn't crucial. It's particularly
valuable in industry settings for automation and decision support.

### Unsupervised Learning: Discovering Hidden Patterns

_This mindset focuses on finding inherent structures in data without labelled
outcomes, making it ideal for exploratory analysis and pattern discovery._

Key Aspects:

- Discovers patterns in data distributions
- Includes clustering, dimensionality reduction, anomaly detection
- No ground truth for validation
- More open-ended than supervised learning

Primary Strengths:

1. Finds patterns other approaches might miss
2. Excellent for initial data exploration
3. Flexible for undefined problems
4. Can reveal natural groupings in data

Notable Limitations:

1. Hard to validate results objectively
2. Feature weighting is often arbitrary
3. Suffers from curse of dimensionality[^2]
4. No guarantee of finding meaningful patterns

For practitioners, unsupervised learning is valuable for initial data
exploration and when labelled data isn't available. It's particularly useful in
customer segmentation, anomaly detection, and dimension reduction.

### Reinforcement Learning: Learning Through Interaction

_This mindset models an agent interacting with an environment, making decisions
and learning from rewards._

Key Aspects:

- Agent learns by taking actions and receiving rewards
- Handles delayed and sparse rewards
- Balances exploration and exploitation
- Creates its own training data through interaction

Primary Strengths:

1. Models dynamic real-world interactions
2. Designed for sequential decision-making
3. Can discover novel strategies
4. Learns through direct experience
5. Combines well with deep learning

Notable Limitations:

1. Not all problems fit agent-environment framework
2. Often unstable or difficult to train
3. May perform poorly in real-world conditions
4. Requires careful reward design
5. Complex implementation choices

For practitioners, reinforcement learning is valuable for problems involving
sequential decisions or control, particularly in robotics, game playing, and
resource management.

### Deep Learning: End-to-End Neural Networks

_This mindset approaches problems through deep neural networks, letting the
model learn both features and relationships._

Key Aspects:

- Models tasks end-to-end through neural networks
- Learns hierarchical representations automatically
- Highly modular architecture design
- Benefits from transfer learning and pre-trained models

Primary Strengths:

1. Has achieved strong results on many image, text and speech tasks
2. Learns useful feature representations
3. Highly modular and customisable
4. Strong tooling and community support
5. Can handle multiple inputs/outputs seamlessly

Notable Limitations:

1. Tree ensembles are often stronger baselines on medium-sized tabular datasets
2. Training from scratch can require large datasets, while transfer learning
   changes the trade-off
3. Computationally intensive
4. Hard to train and tune effectively
5. Results can be difficult to interpret

For practitioners, deep learning is essential for complex data types but may be
overkill for simpler problems. Most valuable in computer vision, natural
language processing, and other complex pattern recognition tasks.

## Conclusion

_**aka Choosing Your Modelling Path**_

For developing T-shaped expertise in modelling, the practitioner's choice should
align with their primary domain while maintaining broader awareness. Here's how
to approach this decision:

- _Scientific research_ often needs statistical modelling, experimental design
  and domain-specific measurement.

- _Business prediction_ may use supervised learning when representative labelled
  outcomes exist.

- _Images, text and audio_ often justify testing pretrained deep-learning models
  alongside simpler baselines.

- _Interventions and policies_ need causal reasoning to distinguish correlation
  from causation and understand intervention effects.

- _Sequential control_ may use reinforcement learning, optimisation, control
  theory or a combination.

Practical applications frequently combine mindsets:

- _Industry/Business_ can combine Supervised Learning with Unsupervised
  Learning, enabling predictions alongside pattern discovery.

- _Research_ pairs Statistical Modelling with Machine Learning, balancing
  academic rigour with modern capabilities.

- _Product Development_ merges Deep Learning with Supervised Learning for
  end-to-end features with clear metrics.

- _Medical diagnostics_ may combine prediction, statistical validation, causal
  evidence and decision analysis under clinical and regulatory oversight.

The choice should be based on the practitioner's domain requirements,
computational resources, interpretability needs, and available time for mastery.
_Remember:_ Mastery of one mindset with broad awareness surpasses superficial
knowledge of many.

---

[^1]: Posterior uncertainty covers only what the model and prior represent.
    Misspecification, selection bias and unknown data-generating changes do not
    disappear merely because an analysis is Bayesian.

[^2]: Here is a
    [nice digital flashcard](https://bsky.app/profile/chrisalbon.com/post/3lbendflq2w2n)
    by Chris Albon, on the concept of _curse of dimensionality_

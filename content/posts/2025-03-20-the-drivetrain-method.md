---
layout: post
title: "⚙️ Turning Data Science into Real-World Value with The Drivetrain Framework"
date: 2025-03-20
tags: [
  data-science,
  decision-making,
  machine-learning,
  modelling-mindsets,
  optimisation,
  fast-ai,
  advantage,
  best-practices,
  design-principles,
  causal-inference,
  business-value,
  predictive-modelling,
  integration,
  deliberate-experimentation,
  real-value,
]
---

**TL;DR:** Jeremy Howard's Drivetrain Framework connects data science to
decisions through four questions: what is the objective, which inputs can be
controlled, what evidence links actions to outcomes, and which models or
optimisers support the decision? It is a useful design framework, not a
guarantee that experimentation or optimisation will create value.

<!--more-->

## Introduction

One recurring failure mode in data science is focusing on prediction without
defining the action that will follow. A sophisticated model may describe what
_might_ happen while providing no clear path to influencing the outcome.\
Jeremy Howard addressed this gap in his 2012 presentation of the
"[Drivetrain Framework](https://www.youtube.com/watch?v=vYrWTDxoeGg)". Drawing
on work in insurance pricing, Howard outlines a systematic way to connect models
with decisions and measurable objectives.\
The framework is not about building more complex algorithms. It asks how a
prediction changes a decision and how that decision affects an outcome. That
offers a practical way to diagnose analytics work that produces interesting
estimates but no clear action.

## The Four Critical Components

The Drivetrain Framework consists of four interconnected steps that bridge the
gap between data and value:

### 1. Define Your Objective

Begin with absolute clarity about what you're trying to achieve. In Howard's
insurance example, the objective was straightforward: maximise profit from each
customer based on price. For Google's search engine, it was finding the most
relevant web page based on a query. For a marketing team, it might be maximising
customer lifetime value.\
Without a clear objective, data science becomes an academic exercise. With one,
it becomes a targeted tool for value creation.

### 2. Identify Your Levers

Next, determine what variables you can actually control. These are your
"levers" - the actions you can take to influence outcomes:

- For Google, the key lever was the ordering of search results
- For insurers, it was the price offered to each customer
- For marketers, levers include product recommendations, discount offers, and
  communication timing

The insight here is focusing not on what you can predict, but on what you can
change.

### 3. Collect Causal Data

Howard emphasises a crucial distinction: most organisations have plenty of
observational data showing correlations, but lack causal data showing what
happens when you pull different levers.\
This requires intentional experimentation:

- The insurance company randomly varied prices to estimate the causal
  price-response relationship
- A marketing team might test diverse recommendations rather than showing only
  what customers already appear to like

The counterintuitive insight is that short-term exploitation can prevent
learning about alternatives. Howard describes persuading an insurer to vary
prices so it could estimate a price-response relationship. Such experiments
require legal, ethical and customer-impact review; randomisation is not
automatically permissible, and the results reported in a presentation should not
be treated as a general profit forecast.

### 4. Build an Integrated System

The final step combines three elements to connect levers to objectives:

- **Modeller**: Build predictive models for key relationships, such as how price
  affects purchase probability
- **Simulator**: Combine models to estimate how actions affect the objective
  across customer segments
- **Optimiser**: Find the lever settings that best satisfy the objective and
  constraints

This integrated approach replaces the need for complex "PageRank-like"
algorithms with systems that combine simpler models to optimise real-world
outcomes.

## Application: Revolutionising Marketing

In the language of the 2012 presentation, Howard argues that marketing analytics
was ready for a more decision-focused approach. A less rhetorical way to state
the point is that recommendation systems should be evaluated against their
intended outcome, not only prediction accuracy. Consider Amazon's recommendation
system. Rather than simply suggesting more books by authors you've already read,
a Drivetrain-based system would:

1. Define the objective as maximising customer lifetime value
2. Identify recommendation content as a key lever
3. Collect causal data by testing diverse recommendations, including unexpected
   ones
4. Build an integrated system that models what customers might enjoy but do not
   yet know about, and optimise for long-term value

Howard reports improvements in engagement, retention and marketing cost from
applying this approach. Those results are examples from the presentation rather
than a guarantee for every organisation.

## Drawing from Engineering

Howard notes that many solutions already exist in engineering disciplines, which
data scientists would benefit from studying.\
Aircraft designers have used integrated models and optimisation for decades,
combining aerodynamic models, structural analysis, and optimisation techniques
to create planes that safely fly millions of passengers daily.\
Building construction similarly relies on systems that integrate architectural
models, structural engineering, and materials science to optimize for safety,
cost, and aesthetics.\
Automated-driving research provides another example of perception, prediction,
planning and control being evaluated as one system. It also shows why component
performance does not by itself establish end-to-end safety. The broader
engineering lesson is to model interfaces and system behaviour, not that a
collection of simple models necessarily solves a complex problem.

## Conclusion

The Drivetrain Framework offers a useful shift in emphasis:

1. Move beyond building better predictive models in isolation
2. Focus on connecting predictions to actions that drive real value
3. Invest in collecting causal data through deliberate experimentation
4. Integrate modelling, simulation, and optimisation into coherent systems

The framework helps expose the gap between an accurate model and a useful
decision. Whether an integrated system creates value still depends on the
objective, evidence, constraints and behaviour of people affected by it.

## Getting Started

To begin implementing the Drivetrain approach:

1. Identify one high-value business objective with measurable outcomes
2. Map the specific levers your team can control that influence this objective
3. Design an ethical, proportionate way to estimate how those levers affect the
   outcome
4. Start with simple models for key relationships before attempting
   sophisticated optimisation

The most important step is shifting your thinking from "_what can we predict?_"
to "_what actions can we take to create value?_" - the essence of the Drivetrain
Framework.

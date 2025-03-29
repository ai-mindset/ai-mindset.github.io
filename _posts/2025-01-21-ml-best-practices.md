---
layout: post
title: "🔧 A 5-Minute Guide to Engineering Machine Learning Systems"
date: 2025-01-21
tags: [machine-learning, best-practices, mlops, monitoring, production, quality-assurance, data-science, decision-making]
---
<!--more-->

## Introduction
This is a concise reference guide distilling Martin Zinkevich's [influential Google article on machine learning best practices](https://developers.google.com/machine-learning/guides/rules-of-ml). While the original spans 43 detailed rules, this 10-minute summary captures the essential principles for building production ML systems. Whether you're starting a new project or reviewing an existing one, this summary can be used as a practical checklist for engineering-focused machine learning.

## Core Philosophy
> Do machine learning like the great engineer you are, not like the great machine learning expert you aren't.

Most ML gains come from great features, not algorithms. The basic approach should be:
1. Ensure solid end-to-end pipeline
2. Start with reasonable objective
3. Add common-sense features simply
4. Maintain pipeline integrity

## Phase I: Before Machine Learning (Rules #1-3)
1. **Don't be afraid to launch without ML**
   - Simple heuristics get you 50% of the way
   - Launch with heuristics when data is insufficient
   - Example: Use install rate for app ranking

2. **First, design and implement metrics**
   - Track everything possible in current system
   - Get early permission from users
   - Design systems with metric instrumentation
   - Implement experiment framework

3. **Choose ML over complex heuristics**
   - Simple heuristics for launching
   - Complex heuristics become unmaintainable
   - ML models are easier to maintain long-term

## Phase II: First Pipeline (Rules #4-11)
1. **Keep first model simple, get infrastructure right**
   - Focus on data pipeline integrity
   - Define clear evaluation metrics
   - Plan model integration carefully

2. **Pipeline Health is Critical**
   - Test infrastructure independently
   - Monitor freshness requirements
   - Watch for silent failures
   - Give feature columns owners
   - Document feature expectations

3. **Starting Your ML System**
   - Test getting data into algorithm
   - Test getting models out correctly
   - Monitor data statistics continuously
   - Build alerting system

## Your First Objective (Rules #12-15)
1. **Choose Objectives Wisely**
   - Don't overthink initial objective choice
   - Start with simple, observable metrics
   - Use directly observed user behaviours
   - Example: clicks, downloads, shares

2. **Model Selection Guidelines**
   - Start with interpretable models
   - Separate spam filtering from quality ranking
   - Use simple linear models initially
   - Make debugging easier

## Phase III: Feature Engineering (Rules #16-22)
1. **Plan to launch and iterate**
   - Expect regular model updates
   - Design for feature flexibility
   - Keep infrastructure clean

2. **Feature Engineering Principles**
   - Start with directly observed features
   - Use cross-product features wisely
   - Clean up unused features
   - Scale feature complexity with data

3. **Feature Coverage and Quality**
   - Features that generalise across contexts
   - Monitor feature coverage
   - Document feature ownership
   - Regular feature clean-up

## Human Analysis (Rules #23-28)
1. **Testing and Validation**
   - Use crowdsourcing or live experiments
   - Measure model deltas explicitly
   - Look for error patterns
   - Consider long-term effects

2. **Common Pitfalls**
   - Engineers aren't typical users
   - Beware of confirmation bias
   - Quantify undesirable behaviours

## Training-Serving Skew (Rules #29-37)
1. **Prevent Skew**
   - Save serving-time features
   - Weight sampled data properly
   - Reuse code between training/serving
   - Test on future data

2. **Monitor Everything**
   - Track performance metrics
   - Watch data distributions
   - Monitor feature coverage
   - Check prediction bias

## Phase IV: Optimisation and Complex Models (Rules #38-43)
1. **When to Add Complexity**
   - After simple approaches plateau
   - When objectives are well-aligned
   - If maintenance cost justifies gains

2. **Advanced Techniques**
   - Keep ensembles simple
   - Look for new information sources
   - Balance complexity vs. benefits

## Final Recommendations
1. **Launch Decisions**
   - Consider multiple metrics
   - Use proxies for long-term goals
   - Balance simple vs. complex

2. **System Evolution**
   - Start simple, add complexity gradually
   - Monitor consistently
   - Keep infrastructure clean
   - Document everything

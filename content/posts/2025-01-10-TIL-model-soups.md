---
layout: post
title: "💡 TIL: A Simple Yet Effective Ensemble Technique called Model Soup 🍲"
date: 2025-01-10
tags: [
  neural-network,
  machine-learning,
  performance,
  mlops,
  production,
  evaluation,
]
---

**TL;DR:** Model soups average the weights of compatible fine-tuned models to
produce one model with single-model inference cost. The original paper found
that selected soups could improve on the best individual model and approach an
output ensemble's accuracy on its experiments. Weight averaging is not
guaranteed to work when models occupy incompatible regions of parameter space.

<!--more-->

## Introduction

While most ensemble methods in machine learning combine model predictions,
thanks to
[Chris Albon](https://bsky.app/profile/chrisalbon.com/post/3lfbbixka7c25) I
recently learned about an alternative approach called "_model soups_" that works
directly with model parameters. Instead of aggregating outputs, model soups
blend the actual weights and biases of neural networks, showing promising
results in computer vision and language tasks.

## Main Concept

Model soups are created by averaging the parameters of models that start from
the same pre-trained model and are fine-tuned with different hyperparameters.
This shared starting point is important; independently trained networks can
represent similar functions with incompatible parameter arrangements. For
example, if we have three compatible models with weights 2.32, 4.21, and 1.23
for a particular parameter, the "souped" model would use (2.32 + 4.21 + 1.23) /
3 = 2.587 for that parameter. This process is repeated across all parameters in
the network.

The [model soups paper](https://arxiv.org/abs/2203.05482) describes uniform
averaging and a greedy variant that retains a candidate only when it improves
validation performance. In the reported transfer-learning experiments, soups
often improved on the best individual model and could approach the accuracy of
an output ensemble without paying multi-model inference cost. The validation
procedure is part of the method; arbitrary averaging can make performance worse.

## Conclusion

Model soups show that compatible fine-tuned solutions can sometimes be combined
in parameter space. Their practical attraction is deployment cost: after
selection and averaging, only one model runs at inference time. Compare the soup
with the best checkpoint and an output ensemble on a held-out set; the technique
is an option, not a free improvement.

---
layout: post
title: "📐 Sparse Autoencoders: A Technical Overview"
date: 2025-01-09
tags: [
  ai,
  llm,
  neural-network,
  machine-learning,
  data-science,
  linear-algebra,
  statistics,
  evaluation,
  interpretability,
  modelling-mindsets,
  design-principles,
  best-practices,
  data-processing,
]
---

**TL;DR:** Sparse autoencoders learn a representation by reconstructing their
input while encouraging most hidden activations to remain near a target low
rate. A classic formulation combines reconstruction loss, weight decay and a
KL-divergence sparsity penalty. The learned features can be useful or
interpretable, but neither property is automatic.

<!--more-->

## Introduction

Andrew Ng's
[CS294A lecture notes](https://web.stanford.edu/class/cs294a/sparseAutoencoder.pdf)
present sparse autoencoders as an unsupervised feature-learning method. The
historical motivation was to reduce dependence on hand-designed features by
learning representations from unlabelled inputs. Modern supervised deep networks
also learn features, so the relevant distinction is the training objective and
availability of labels rather than a universal limitation of supervised
learning.

Sparse autoencoders have two defining ingredients:

1. They attempt to reconstruct their input through a bottleneck or constrained
   hidden representation.
2. They penalise activation patterns that depart from a chosen sparsity target.

The mathematical framework combines reconstruction error, regularisation and
sparsity. Biological firing patterns helped motivate some terminology, but the
engineering objective should not be taken as a faithful model of a brain. This
overview follows the classic sigmoid and KL-divergence formulation in the
Stanford notes; modern sparse autoencoders can use different architectures and
penalties.

## Sparse Autoencoders

An autoencoder is a neural network trained to reconstruct its input. In this
sparse formulation, a penalty encourages hidden units to have a low average
activation. The basic architecture is:

```
Input (x) -> Hidden Layer (sparse activation) -> Output (x̂)
```

Where:

- Input and output dimensions are equal $(x, \hat{x} \in \R^n)$
- Hidden layer learns a sparse representation
- Network uses sigmoid activation: $f(z) = \frac{1}{1+e^{-z}}$

## Mathematical Framework

1. **Base Cost Function** (single training example):

   $$J(W,b; x,y) = \frac{1}{2}||h_{W,b}(x) - y||^2$$

   For a single training example:
   - Measures reconstruction error between network output $h_{W,b}(x)$ and
     target $y$
   - For autoencoders: $y = x$ (we reconstruct the input)
   - $\frac{1}{2}$ factor simplifies gradient computations
   - Squared L2 norm penalises larger reconstruction errors quadratically

2. **Full Cost Function with Weight Decay**:

   The cost function $J(W,b)$ combines the average reconstruction error\
   $\frac{1}{m}\sum_{i=1}^m \frac{1}{2}||h_{W,b}(x^{(i)}) - x^{(i)}||^2$

   with weight-decay regularisation to discourage large weights:\
   $\frac{\lambda}{2}\sum_{l=1}^{n_l-1}\sum_{i=1}^{s_l}\sum_{j=1}^{s_{l+1}}(W_{ji}^{(l)})^2$

   $$J(W,b) = \left[\frac{1}{m}\sum_{i=1}^m \frac{1}{2}||h_{W,b}(x^{(i)}) - y^{(i)}||^2\right] + \frac{\lambda}{2}\sum_{l=1}^{n_l-1}\sum_{i=1}^{s_l}\sum_{j=1}^{s_{l+1}}(W_{ji}^{(l)})^2$$

   Key points:
   - For autoencoders, output $y^{(i)}$ equals input $x^{(i)}$
   - Weight decay applies only to weights $W$, not biases $b$
   - $\lambda$ balances reconstruction accuracy vs. weight magnitude
   - The $\frac{1}{2}$ factor simplifies derivative calculations in
     backpropagation
   - This regularisation is distinct from the sparsity constraint (the
     KL-divergence term)

3. **Sparsity Measurement**:

   The average activation $\hat{\rho}_j$ measures how frequently hidden unit $j$
   fires across the training set:

   $$\hat{\rho}_j = \frac{1}{m}\sum_{i=1}^m[a_j^{(2)}(x^{(i)})]$$

   Key points:
   - $a_j^{(2)}(x^{(i)})$ is hidden unit $j$'s activation for input $x^{(i)}$
   - With sigmoid activation, values near 1 mean "active" or "firing"
   - Values near 0 mean "inactive"
   - We constrain $\hat{\rho}_j \approx \rho$ where $\rho$ is small (typically
     0.05)
   - This encourages selective firing: each neuron responds strongly to
     particular input patterns

4. **Sparsity Penalty** (using
   [KL divergence](https://en.wikipedia.org/wiki/Kullback%E2%80%93Leibler_divergence)):

   The sparsity penalty uses KL divergence to enforce
   $\hat{\rho}_j \approx \rho$:

   $$\sum_{j=1}^{s_2}\rho\log\frac{\rho}{\hat{\rho}_j} + (1-\rho)\log\frac{1-\rho}{1-\hat{\rho}_j}$$

   Properties of this penalty:
   - Minimised (zero) when $\hat{\rho}_j = \rho$
   - Monotonically increases as $\hat{\rho}_j$ deviates from $\rho$
   - Becomes infinite as $\hat{\rho}_j$ approaches 0 or 1

5. **Final Cost Function**:

   $$J_{sparse}(W,b) = J(W,b) + \beta\sum_{j=1}^{s_2}KL(\rho||\hat{\rho}_j)$$

   Components:
   - $J(W,b)$: Standard autoencoder cost (reconstruction error + weight decay)
   - Sparsity term: KL divergence penalty summed over $s_2$ hidden units

   $\beta$ controls:
   - Balance between accurate reconstruction and sparse representation
   - Strength of sparsity enforcement
   - Higher $\beta$ → stronger sparsity constraint

   This formulation naturally penalises both over- and under-activation of
   hidden units relative to target sparsity $\rho$.

## Training Process

The key modification to standard backpropagation occurs in the hidden layer. The
sparsity derivative is included before multiplying by the activation derivative:

$$ \delta_i^{(2)} = \left(\sum_{j=1}^{s_3}W_{ji}^{(3)}\delta_j^{(3)} + \beta\left(-\frac{\rho}{\hat{\rho}_i} + \frac{1-\rho}{1-\hat{\rho}_i}\right)\right)f'(s_i^{(2)}) $$

This lets gradient descent optimise the reconstruction and sparsity terms
together.

Here, the first term propagates the reconstruction error, the second
differentiates the KL-divergence penalty, $s_i^{(2)}$ is the weighted input to
hidden unit $i$, and $\hat{\rho}_i$ is estimated over the training data.

## Practical Guidelines

- $\rho$ ≈ 0.05 (5% target activation rate)
- $\beta$ controls sparsity penalty strength
- Initialise weights randomly near zero
- Must compute forward pass on all examples first to calculate $\hat{\rho}$

## Results

On suitable natural-image patches, classic sparse-coding experiments often learn
localised, oriented features resembling edge detectors. That is evidence that
the objective can discover useful image structure, not validation of a
biological theory or a guarantee for every dataset.

## Conclusion

Sparse autoencoders provide a clear approach to unsupervised representation
learning. In this formulation, a KL-divergence penalty encourages hidden units
to meet a target average activation. It encourages selective features but does
not force them to be human-interpretable.

The mathematical framework achieves this through three key components:

1. A reconstruction cost that ensures faithful data representation
2. A weight decay term that prevents overfitting
3. A sparsity penalty that enforces selective neural activation

This formulation has proven successful in practice, typically leading to:

- Edge and feature detectors emerging naturally from visual data
- Selective representations that can sometimes be inspected or labelled
- Robust feature learning even with
  [overcomplete](https://en.wikipedia.org/wiki/Overcompleteness) hidden layers

Sparse autoencoders show how a reconstruction objective and an explicit
representation constraint can learn features without labels. Their limitations
include hyperparameter sensitivity, reconstruction-feature trade-offs and the
difficulty of deciding whether a learned feature is genuinely coherent.
Evaluation should test the representation on the downstream or interpretability
task that motivated it.

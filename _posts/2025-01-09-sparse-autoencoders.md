---
layout: post
title: "Sparse Autoencoders: A Technical Overview"
date: 2025-01-09
tags: [ai, llm]
---
<!--more-->

### 1. Core Architecture & Motivation
Sparse autoencoders are neural networks that learn efficient data representations by:
1. Reconstructing their input under a sparsity constraint
2. Forcing hidden units to respond selectively, similar to biological neurons
3. Using an encoder-decoder structure: Input → Sparse Hidden Layer → Reconstruction

### 2. Mathematical Foundation

**Basic Autoencoder Cost**:
$$ J_{basic}(W,b) = \frac{1}{2m}\sum_{i=1}^m ||h_{W,b}(x^{(i)}) - x^{(i)}||^2 + \frac{\lambda}{2}\sum_{l=1}^{n_l-1}\sum_{i=1}^{s_l}\sum_{j=1}^{s_{l+1}}(W_{ji}^{(l)})^2 $$

Where:
- First term: Reconstruction error (how well we recreate the input)
- Second term: Weight decay preventing overfitting (λ controls strength)
- Activation function: $f(z) = \frac{1}{1+e^{-z}}$ (sigmoid) or $tanh(z)$

**Sparsity Mechanism**:
1. Calculate average activation for each hidden unit j:
$$ \hat{\rho}_j = \frac{1}{m}\sum_{i=1}^m[a_j^{(2)}(x^{(i)})] $$

2. Enforce sparsity via KL divergence between desired sparsity ρ and actual activation ρ̂:
$$ KL(\rho||\hat{\rho}_j) = \rho\log\frac{\rho}{\hat{\rho}_j} + (1-\rho)\log\frac{1-\rho}{1-\hat{\rho}_j} $$

*Why KL divergence?* It provides smooth gradients and naturally handles probability distributions between 0 and 1, matching our activation function range.

**Complete Cost Function**:
$$ J_{sparse}(W,b) = J_{basic}(W,b) + \beta\sum_{j=1}^{s_2}KL(\rho||\hat{\rho}_j) $$
Where β controls the strength of sparsity enforcement.

### 3. Training Process

1. **Forward Pass**:
```
Input → Hidden Layer Activation → Output
Calculate ρ̂j for each hidden unit
```

2. **Backward Pass**:
Modified backpropagation with sparsity gradient:
$$ \delta_i^{(2)} = \left(\sum_{j=1}^{s_3}W_{ji}^{(2)}\delta_j^{(3)}\right)f'(z_i^{(2)}) + \beta\left(-\frac{\rho}{\hat{\rho}_i} + \frac{1-\rho}{1-\hat{\rho}_i}\right) $$

### 4. Practical Implementation

**Key Hyperparameters**:
- Target sparsity: ρ ≈ 0.05 (5% average activation)
- Sparsity weight: β ≈ 3 (start here, adjust based on results)
- Learning rate: α ≈ 0.1 (decrease if training unstable)
- Weight decay: λ ≈ 0.0001 (prevents weight explosion)

**Common Challenges**:
1. Vanishing gradients with very low sparsity targets
2. Dead units if sparsity penalty too high
3. Poor reconstruction if hidden layer too small

**Emergent Properties**:
- Hidden units learn natural features (edges, textures)
- Representations more interpretable than standard autoencoders
- Similar feature detectors emerge across different datasets

This formulation balances theoretical understanding with practical implementation guidance, making it both rigorous and useful.

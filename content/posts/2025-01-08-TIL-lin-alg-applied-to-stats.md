---
layout: post
title: "💡 TIL: The Matrix Equation Behind Linear Regression"
date: 2025-01-08
tags: [
  data-science,
  machine-learning,
  statistics,
  linear-algebra,
  til,
  modelling-mindsets,
  data-modeling,
]
---

**TL;DR:** Ordinary least squares can be expressed through the normal equations,
$X^TX\beta = X^Ty$. When $X$ has full column rank, this gives
$\hat{\beta} = (X^TX)^{-1}X^Ty$. In numerical software, explicitly forming the
inverse is usually avoided; QR, SVD or specialised least-squares solvers are
more stable, while iterative methods help at very large scale.

<!--more-->

## Introduction

An
[interview question about linear regression](https://x.com/andrew_n_carr/status/1876855682529480844)
prompted me to revisit the matrix algebra behind ordinary least squares. The
familiar closed-form equation is useful for understanding the model, but it is
not normally the best implementation recipe.

## From a Loss Function to the Normal Equations

Given a design matrix $X$, target vector $y$ and coefficient vector $\beta$,
ordinary least squares minimises

$$
\lVert y - X\beta \rVert_2^2.
$$

Differentiating with respect to $\beta$ and setting the gradient to zero gives

$$
X^TX\beta = X^Ty.
$$

These are the normal equations. If the columns of $X$ are linearly independent,
$X^TX$ is invertible and the unique solution is

$$
\hat{\beta} = (X^TX)^{-1}X^Ty.
$$

The terms have useful interpretations:

- $X^TX$ contains dot products between features. With centred data, those values
  are proportional to feature covariances.
- $X^Ty$ contains dot products between each feature and the target. With centred
  data, these are proportional to feature-target covariances.
- Solving the system estimates each coefficient while accounting for the other
  columns in $X$.

If $X$ is rank deficient, the coefficients are not uniquely identified. A
pseudoinverse can select a least-norm solution, but that does not make the
underlying collinearity disappear.

## Why Software Usually Does Not Compute the Inverse

Writing the inverse makes the algebra compact. Computing it explicitly can make
the program less stable.

Forming $X^TX$ costs roughly $O(np^2)$ for $n$ observations and $p$ features,
and solving the resulting dense system costs roughly $O(p^3)$. More importantly,
forming $X^TX$ squares the condition number of $X$, which amplifies numerical
problems when features are nearly collinear.

Practical implementations therefore tend to use:

- **QR decomposition** for a stable direct least-squares solution.
- **Singular value decomposition (SVD)** when rank deficiency or conditioning
  needs careful treatment.
- **Iterative solvers** such as LSQR, stochastic gradient descent or related
  methods when the data is sparse, very large or processed in batches.

Gradient descent is not automatically the default for ordinary least squares.
For many small and medium dense problems, QR or SVD is both straightforward and
reliable. The right method depends on shape, sparsity, conditioning and
available memory.

## A Better Mental Model

The closed-form equation explains what is being optimised. A numerical solver
explains how to obtain the answer reliably on a computer. Confusing those two
levels is the common trap.

For a broader treatment, see
_[The Elements of Statistical Learning](https://doi.org/10.1007/978-0-387-84858-7)_
by Hastie, Tibshirani and Friedman.

## Conclusion

The normal equations are worth learning because they connect regression,
geometry and covariance. In production code, use a well-tested least-squares
implementation and let the problem's numerical properties determine the solver.
The elegant equation is the starting point for understanding, not an instruction
to call a matrix inverse.

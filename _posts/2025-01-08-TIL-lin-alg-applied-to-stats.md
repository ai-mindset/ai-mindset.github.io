---
layout: post
title: "💡 TIL: The Matrix Equation That Makes Linear Regression Work"
date: 2025-01-08
tags: [data-science, machine-learning, statistics, ai, linear-algebra, til, modelling-mindsets, data-modeling]
---
<!--more-->

## Introduction
This morning [an interesting interview question](https://xcancel.com/andrew_n_carr/status/1876855682529480844) motivated me to remind myself how it's possible to solve linear regression through matrix algebra. Below is what I learned:  

## The Theory: An Elegant Mathematical Solution
Linear regression finds the best-fit line through data points by finding optimal coefficients ($\beta$) that minimise squared errors. The equation $\beta = (X^TX)^{-1}X^Ty$ elegantly solves this optimization problem using matrix algebra.

The solution involves these key components:
1. $X$ is our feature matrix (n samples × p features)
2. $y$ is our target values (n × 1)
3. $X^T$ is the transpose of X
4. $\beta$ is our solution vector (p × 1) of coefficients

Here's how this elegant solution works:  
1. $X^TX$ creates a $(p \times p)$ matrix of feature products:  
   - Each element $(i,j)$ contains the dot product between features $i$ and $j$
   - When features are centred, these products are proportional to covariances[^1]
   - When features are also standardised, it yields correlations scaled by $n$

2. $(X^TX)^{-1}$ computes the inverse of this matrix:  
   - Compensates for feature correlations in coefficient calculations[^2]
   - Required for solving the normal equations $X^TX\beta = X^Ty$
   - Exists only when no feature is a linear combination of others

3. $X^Ty$ creates a $(p \times 1)$ vector of feature-target products:  
   - Each element $i$ contains the dot product of feature $i$ with target $y$
   - Represents raw feature-target relationships before adjustment
   - When centred, proportional to feature-target covariances[^3]

4. Final multiplication $(X^TX)^{-1}X^Ty$:  
   - Solves the normal equations $X^TX\beta = X^Ty$
   - Accounts for inter-feature correlations in determining coefficients
   - Mathematically guarantees minimum squared error

For more information, check Hastie, Tibshirani & Friedman's "[Elements of Statistical Learning](https://archive.org/details/elementsofstatis0000hast)" seminal book. 

## The Real-World Catch
While mathematically elegant, this direct solution has practical limitations in real-world applications:  
1. _Computational Complexity_: Computing $(X^TX)^{-1}$ requires $\Omicron(n^3)$ operations, becoming prohibitively expensive for large feature sets. This is why gradient descent, with its $\Omicron(n^2)$  per-iteration complexity, often proves more practical.  
2. _Numerical Instability_: When features are highly correlated (like monthly and annual income), $X^TX$ becomes nearly singular. Even small rounding errors in the computation of its inverse can lead to large errors in $\beta$. In extreme cases, when features are perfectly correlated, the inverse doesn't exist at all. Gradient descent avoids this matrix inversion entirely.    
3. _Memory Constraints_: Large datasets require holding the entire $X^TX$ matrix in memory, while gradient descent can work with mini-batches, making it more memory-efficient.  

## Conclusions
While this equation brilliantly demonstrates the power of linear algebra in statistics, real-world machine learning often favours gradient descent's iterative approach. Think of it as choosing between a perfect GPS route through heavy traffic (direct solution) versus taking smaller, adaptable steps through clear side streets (gradient descent). Both reach the same destination, but the practical path often wins in real-world conditions.

---
[^1]: When features are centred (mean = 0), each product becomes $n$ times the covariance. This means $X^TX$ captures how features vary together, which is crucial because correlated features can lead to unstable coefficients if not accounted for. The relationship between $X^TX$ and covariance comes from the definition of sample covariance: $cov(X_i, X_j) = \frac{1}{n-1}\sum_{k=1}^n (x_{ki} - \bar{x_i})(x_{kj} - \bar{x_j})$. When data is centred, this simplifies to $\frac{1}{n-1}(X^TX)_{ij}$.  $\frac{X^TX}{n-1}$ returns the sample covariance matrix. This matters because a) when features are uncentred, $(X^TX)$ gives the sum of products, b) when centred $\frac{X^TX}{n-1}$ gives covariances, c) when also standardised (std = 1), $\frac{X^TX}{n-1}$ gives correlations.
[^2]: Adjusts coefficient estimates to account for shared information between features. For example, if height and weight are correlated, we need to determine each variable's unique contribution to the prediction, not their overlapping effect.
[^3]: When centred, each element becomes $n$ times the covariance between a feature and the target. This reveals how each feature individually relates to $y$ before accounting for other features' effects, providing a starting point for determining final coefficients.

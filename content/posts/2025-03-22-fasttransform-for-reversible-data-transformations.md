---
layout: post
title: "⏪ Making Data Transformations Reversible with fasttransform"
date: 2025-03-22
tags: [
  machine-learning,
  data-processing,
  fast-ai,
  python,
  data-science,
  optimisation,
  best-practices,
  interpretability,
]
---

**TL;DR:** Fasttransform lets transformations define matching encode and decode
operations, making transformed data easier to inspect. Its type-dispatched
pipelines can apply different behaviour to images, labels and other inputs. This
helps debug data preparation, but inspecting decoded inputs alone does not
explain which features a model used.

<!--more-->

## Introduction

Machine learning practitioners face a common problem: after applying multiple
transformations to prepare data for training, it becomes difficult to visualise
what the model actually sees. This visualisation gap makes debugging challenging
and often leads to missing critical insights about model behaviour.\
For example, consider a model built to distinguish wolves from huskies that
performs poorly on certain images. Without the ability to easily inspect how
transformations affect the input data, one might miss that the model is actually
detecting snow (common in wolf photos) rather than the animals themselves.\
Fast.ai's solution to this problem is
[fasttransform](https://github.com/AnswerDotAI/fasttransform)[^1], a library
that ensures any transformation applied to data can be easily reversed. Let's
explore how it works and why it matters.

## Reversible Pipelines Made Simple

### The Problem with One-Way Transforms

Traditional data transformation pipelines in libraries like PyTorch are one-way
streets. Consider this simple example of normalising an image:

```python
from torchvision import transforms as T
transforms_pt = T.Compose([
    T.Resize(256),
    T.CenterCrop(224),
    T.ToTensor(),
    T.Normalize(*imagenet_stats)
])

img = Image.open("husky.jpeg")
img_transformed = transforms_pt(img)
```

Attempting to visualise `img_transformed` results in a mess of pixel values
outside the displayable range. To see what the model sees, one needs to manually
write an inverse transform function:

```python
def decode_pt(tensor, mean, std):
    out = tensor.clone()
    for t, m, s in zip(out, mean, std): t.mul_(s).add_(m)
    out = out.mul(255).clamp(0, 255).byte()
    return out
```

This is tedious and error-prone, especially as your transformation pipeline
grows more complex.

### An Elegant Solution

fasttransform takes a fundamentally different approach by pairing each
transformation with its inverse. Here's the same pipeline using fasttransform:

```python
from fastai.vision.all import *

transforms_ft = Pipeline([
   PILImage.create,
   Resize(256, method="squish"),
   Resize(224, method="crop"),
   ToTensor(),
   IntToFloatTensor(),
   Normalize.from_stats(*imagenet_stats)
])

# Transform our image
fpath = Path("./huskies_vs_wolves/train/husky/husky_0.jpeg")
img_transformed = transforms_ft(fpath)
# To reverse the transformations:
img_decoded = transforms_ft.decode(img_transformed)
```

The magic lies in how each transform defines both forward and reverse
operations:

```python
class Normalize(Transform):
    def __init__(self, mean=None, std=None):
        self.mean = mean
        self.std = std

    def encodes(self, x): return (x-self.mean) / self.std  # forward transform
    def decodes(self, x): return x*self.std + self.mean    # inverse transform
```

By defining both `encodes` and `decodes` methods, fasttransform automatically
knows how to reverse your transformations. This is particularly valuable when
working with fast.ai v2, where this kind of visualisation capability is built
directly into core functions like `show_batch` and `show_results`.

### Multiple Dispatch: The Secret Sauce

Another powerful feature of fasttransform is how it handles different types of
data. Using a concept called
[multiple dispatch](https://www.youtube.com/watch?v=kc9HwsxE1OY)[^2],
transformations can apply differently based on the type of data they receive.

This becomes particularly valuable when dealing with images and their labels,
allowing a single pipeline to handle both:

```python
# Function that loads both image and its label
def load_img_and_label(fp): return PILImage.create(fp), parent_label(fp)

transforms_ft = Pipeline([
   load_img_and_label,  # Loads both image and label as a tuple
   Resize(256, method="squish"),
   Resize(224, method="crop"),
   ToTensor(),
   IntToFloatTensor(),
   Normalize.from_stats(*imagenet_stats)
])
```

The pipeline intelligently applies each transform only to the appropriate data
types, eliminating the need for separate transformation pipelines.

### Connections to Julia's Multiple Dispatch

Interestingly, the concept of multiple dispatch that fasttransform leverages is
a core feature of the Julia programming language. In Julia, which method of a
function gets called depends on the types of all arguments, not just the first
one (as in traditional object-oriented programming).\
As explained in Julia's documentation: "_Using all of a function's arguments to
choose which method should be invoked, rather than just the first, is known as
multiple dispatch. Multiple dispatch is particularly useful for mathematical
code, where it makes little sense to artificially deem the operations to
'belong' to one argument more than any of the others_".\
The connection to Julia is particularly illuminating, as it demonstrates how
concepts from one language can inspire powerful design patterns in another. Just
as Julia's multiple dispatch enables elegant mathematical code, fasttransform's
implementation of this concept allows for cleaner, more intuitive data pipelines
in Python.

## Conclusion

fasttransform represents a significant step forward in making machine learning
workflows more intuitive and debugging more accessible. By making
transformations reversible through paired encode/decode methods and leveraging
multiple dispatch to handle different data types intelligently, it solves two
fundamental problems in data processing pipelines: the inability to easily
reverse transformations to inspect data, and the need for separate
transformation pipelines for different types of data.\
Visualising transformed data is valuable for finding cropping mistakes, scaling
errors and broken labels. It can also suggest possible confounders such as snow
appearing disproportionately in one class. Establishing that a model actually
relies on the confounder requires targeted evaluation, counterfactual examples
or interpretability methods beyond reversing the input transform. As machine
learning systems grow more complex, tools like fasttransform that improve
transparency and the ability to debug become increasingly valuable. Whether
working with images, text, time series, or other data types, being able to see
what a model sees provides critical insights that might otherwise be missed.\
Returning to the wolf and husky example, decoded batches can reveal the snow
imbalance and motivate a specific test. That is a useful step from observation
to hypothesis, not proof of model behaviour. Those interested in trying
fasttransform can install it with `pip install fasttransform` and consult the
[fasttransform repository](https://github.com/AnswerDotAI/fasttransform) for
current examples and API details.

---

[^1]: Rens Dimmendaal, Hamel Husain, & Jeremy Howard.
    "[fasttransform: Reversible Pipelines Made Simple](https://www.fast.ai/posts/2025-02-20-fasttransform.html)"
    fast.ai blog, February 20, 2025.

[^2]: "[Methods · The Julia Language](https://docs.julialang.org/en/v1/manual/methods/)"
    Julia Documentation, docs.julialang.org.

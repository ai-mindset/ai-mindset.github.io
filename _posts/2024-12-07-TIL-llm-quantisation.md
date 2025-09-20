---
layout: post
title: "💡 TIL: Understanding GGUF Model Quantisation"
date: 2024-12-07
tags: [ai, llm, energy-reduction, performance, quantisation]
---

**TL;DR:** GGUF quantisation converts LLM weights from 16-bit to lower precision formats (2-bit to 6-bit) to run large models on consumer hardware. Each format offers different tradeoffs between size, speed, and quality, with Q4_K_S (4-bit) representing the sweet spot for most users—providing 3.7x size reduction while maintaining good quality. Mixed precision strategies (_S/_M/_L variants) further optimize performance by targeting attention and feed-forward layers with higher precision bits.

<!--more-->

## Introduction
When experimenting with larger language models (12B, 30B, 70B etc.), choosing the right quantisation format becomes crucial for striking a good balance i.e. running them on consumer hardware while maintaining reasonably good performance. I wrote this guide after spending time looking up different GGUF quantisation types to optimise model selection for my machine's constraints. This guide explains quantisation methods and their practical tradeoffs to help the reader select the optimal format for their setup.  
The quantisation formats discussed here are implemented in popular frameworks like [llama.cpp](https://github.com/ggerganov/llama.cpp). Q4_K_S is typically the default format due to its good balance of size, speed, and quality, while Q2_K and Q3_K variants are offered for more constrained systems.

## What is Quantisation?
Quantisation converts model weights from 16-bit floating point (F16) to lower precision formats using fixed-size blocks. Each block contains multiple weights that share scaling parameters.   
Perplexity is the key metric used to measure model quality after quantisation. It indicates how well the model predicts text, the lower the perplexity the better the predictions. For example, a change from 5.91 to 6.78 perplexity represents a noticeable but often acceptable drop in prediction quality. A model with perplexity 6.78 is slightly less certain about its predictions than one with perplexity 5.91.

## Basic Quantisation Types and K-Quantisation
K-quantisation is a way to make AI models smaller using two methods to store weights (the model's numbers):

1. Type-0 (simpler): reconstructs weight as `weight = scale × quant`
2. Type-1 (more precise): reconstructs weight as `weight = scale × quant + minimum`

The "block minimum" `minimum` is the smallest value found in a group of weights. By tracking this minimum, we can represent the other values more precisely relative to it, rather than having to represent their full absolute values.

Each format groups weights into "super-blocks" to save space. Specifically:

Q2_K (2-bit):
- Uses Type-1 formula
- Organises weights in groups of 256 (16 blocks × 16 weights)
- Uses 4 bits to store both scales and minimums
- Takes exactly 2.5625 bits per weight
- Result: Shrinks a 13GB model to 2.67GB, but quality drops (perplexity increases from 5.91 to 6.78)

Q3_K (3-bit):
- Uses Type-0 formula (simpler one)
- Same organisation: 16 blocks × 16 weights
- Uses 6 bits to store scales
- Takes exactly 3.4375 bits per weight
- Better quality than Q2_K but bigger file size

Q4_K (4-bit):
- Uses Type-1 formula
- Different organisation: 8 blocks × 32 weights = 256 total
- Uses 6 bits for both scales and minimums
- Takes exactly 4.5 bits per weight
- Much better quality, file size around 3.56GB

Q5_K (5-bit):
- Uses Type-1 formula
- Same organisation as Q4_K
- Also uses 6 bits for scales and minimums
- Takes exactly 5.5 bits per weight
- Quality getting very close to original

Q6_K (6-bit):
- Uses Type-0 formula
- Back to 16 blocks × 16 weights
- Uses 8 bits for scales
- Takes exactly 6.5625 bits per weight
- Almost perfect quality, file size 5.15GB

The main tradeoff: Fewer bits means smaller files but lower quality. More bits means better quality but larger files. This lets users choose what works best for their needs.  
When compressing numbers in Type-1 quantisation, each block keeps track of its smallest value (the minimum). When reconstructing the weights, this minimum is added back after multiplication. This helps preserve the range of values more accurately than just using scaling alone.

A simple way to think of this concept is:
- Type-0 just stretches/shrinks values using a scale
- Type-1 first shifts all numbers by subtracting the minimum (making them smaller), then scales them for storage, and when reconstructing adds the minimum back

This is why Type-1 generally gives better quality results but needs more storage space. It has to keep track of both the scale and minimum for each block.

## Mixed Precision Strategies
K-quantisations use different precision levels for different model components. From [llama.cpp](https://github.com/ggerganov/llama.cpp) documentation, there are three variants:

- S (Small): Uses single quantisation throughout
  Example using Q3_K_S:  
  > All model tensors → Q3_K (3-bit)  
  > Result: 2.75GB size, 6.46 perplexity (7B model)  

- M (Medium): Strategic mixed precision
  Example using Q3_K_M:  
  > attention.wv[^1], attention.wo[^2], feed_forward.w2[^3] → Q4_K (4-bit)  
  > All other tensors → Q3_K (3-bit)  
  > Result: 3.06GB size, 6.15 perplexity (7B model)  

- L (Large): Higher precision mix
  Example using Q3_K_L:  
  > attention.wv[^1], attention.wo[^2], feed_forward.w2[^3] → Q5_K (5-bit)  
  > All other tensors → Q3_K (3-bit)  
  > Result: 3.35GB size, 6.09 perplexity (7B model)  

These strategies target attention and feed-forward layers with higher precision because they directly impact text processing quality, as demonstrated by the perplexity improvements in benchmarks: Q3_K_S (6.46) → Q3_K_M (6.15) → Q3_K_L (6.09).  
The improvement in perplexity scores demonstrates why mixed precision strategies are effective, though they require more storage space.

## Performance Comparison (7B model)
```
Format | Size(GB) | Reduction | BPW  | Perplexity | RTX4080  | M2Max   
F16    | 13.0     | 1.0x      | 16.0 | 5.91       | 60.0ms   | 116ms
Q2_K   | 2.67     | 4.9x      | 2.56 | 6.78       | 15.5ms   | 56ms
Q3_K_S | 2.75     | 4.7x      | 3.44 | 6.46       | 18.6ms   | 81ms
Q4_K_S | 3.56     | 3.7x      | 4.50 | 6.02       | 15.5ms   | 50ms
Q6_K   | 5.15     | 2.5x      | 6.56 | 5.91       | 18.3ms   | 75ms
```
*BPW = Bits Per Weight, Speed in milliseconds per token

Practical Recommendations:
- Balanced Performance: Q4_K_S
- Maximum Compression: Q2_K
- Best Quality: Q6_K (matches F16)
- Limited RAM: Q2_K or Q3_K
- GPU Inference: Q4_K (optimal speed/quality)

All data are from recent [llama.cpp](https://github.com/ggerganov/llama.cpp/pull/1684) performance benchmarks and [GGML](https://github.com/ggerganov/ggml) implementation details.

## Memory Requirements for Inference
When running quantised models, more RAM is required than the model size alone for inference overhead. Memory requirements depend on several factors:
- Model architecture and size
- Batch size for inference
- Number of layers loaded at once
- Operating system and framework overhead

For 7B models (verified from benchmarks):
```
Format | Model Size | Note
F16    | 13.0GB    | Base format
Q4_K_S | 3.56GB    | Common choice
Q3_K_S | 2.75GB    | Minimum size
Q6_K   | 5.15GB    | Highest quality
```

For larger models scale the memory requirements proportionally and ensure additional overhead memory is available for inference. Test with smaller models first to gauge the system's capabilities.  
Actual RAM/VRAM requirements will be higher than the model size. Consider monitoring memory usage during inference to determine exact requirements for a specific setup.  
Here is an example memory usage scenario for a Q4_K_S 7B model:
- Model size: 3.56GB
- Inference overhead: ~2GB for standard settings
- Operating system buffer: ~1GB recommended
- Total recommended free memory: ~7GB

This explains why a model that's "3.56GB" might need 6-7GB of free RAM/VRAM to run smoothly. The exact overhead varies based on your settings and system.

## Conclusion
Modern quantisation techniques offer multiple ways to run large language models on consumer hardware. Here's what we need to remember:

- K-quantisation provides the best balance through super-blocks and mixed precision strategies
- Q4_K_S (4-bit) represents the current sweet spot for most users, offering:
  - 3.7x size reduction
  - Good perplexity (6.02)
  - Excellent inference speed on both GPU and CPU
- For more constrained setups, Q2_K/Q3_K variants can run larger models with acceptable quality loss
- Higher bits (Q5_K, Q6_K) approach F16 quality but require more memory
- The _S/_M/_L variants let the user fine-tune the quality-size tradeoff by adjusting precision where it matters most

Before downloading a quantised model, check the system's available RAM and choose a format that leaves enough memory for comfortable operation. For most users with modern GPUs, Q4_K variants will provide the best experience.

---
[^1]: In [llama.cpp](https://github.com/ggerganov/llama.cpp/tree/master/examples/convert-llama2c-to-ggml/convert-llama2c-to-ggml.cpp), `attention.wv` refers to a tensor that holds the weights for the value vectors in the self-attention mechanism of the model. This tensor is crucial for determining how much focus the model places on different parts of the input when generating responses. 
[^2]: `attention.wo` refers to the weight matrix used in the output layer of the attention mechanism within a transformer model. It plays a crucial role in transforming the attention output into the final representation that is used for generating predictions.
[^3]: `feed_forward.w1` projects input to a higher-dimensional space, enabling the capture of complex features. `feed_forward.w2` projects transformed input back to the original dimension with a non-linear activation function, whereas `feed_forward.w3` applies an additional transformation to enhance the learning of complex patterns. These matrices collectively enable the feed-forward network to transform and learn from the input effectively, contributing to the overall performance of the transformer model. 


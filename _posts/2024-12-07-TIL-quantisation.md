---
layout: post
title: "Understanding GGUF Model Quantization"
date: 2024-12-07
tags: [ai, llm,]
---
<!--more-->

## Introduction
When experimenting with larger language models (12B, 30B, 70B etc.), choosing the right quantization format becomes crucial for striking a good balance i.e. running them on consumer hardware while maintaining reasonably good performance. I wrote this guide after spending time looking up different GGUF quantization types to Optimize model selection for my machine's constraints. This guide explains quantization methods and their practical tradeoffs to help you select the optimal format for your setup.


## What is Quantization?
Quantization converts model weights from 16-bit floating point (F16) to lower precision formats using fixed-size blocks. Each block contains multiple weights that share scaling parameters. Perplexity measures model quality - lower numbers indicate better text prediction capabilities.


## Basic Quantization Types and K-Quantization
Modern K-quantization uses super-blocks with two approaches:
- Type-0: weight = scale × quant
- Type-1: weight = scale × quant + minimum

K-quantization formats:
- Q2_K: 2-bit type-1
  - 16 blocks × 16 weights per super-block
  - 2.56 bits per weight using 4-bit scales/mins
  - For 7B: 2.67GB size, 6.78 perplexity

- Q3_K: 3-bit type-0
  - 16 blocks × 16 weights per super-block
  - 3.44 bits per weight using 6-bit scales
  - For 7B: 2.75GB-3.35GB size, 6.46-6.09 perplexity

- Q4_K: 4-bit type-1
  - 8 blocks × 32 weights per super-block
  - 4.5 bits per weight using 6-bit scales/mins
  - For 7B: 3.56GB-3.80GB size, 6.02-5.96 perplexity

- Q5_K: 5-bit type-1
  - Identical structure to Q4_K
  - 5.5 bits per weight using 6-bit scales/mins
  - For 7B: 4.33GB-4.45GB size, 5.94-5.92 perplexity

- Q6_K: 6-bit type-0
  - 16 blocks × 16 weights per super-block
  - 6.56 bits per weight using 8-bit scales
  - For 7B: 5.15GB size, 5.91 perplexity


## Mixed Precision Strategies
K-quants use different precision levels for different model components. From [llama.cpp](https://github.com/ggerganov/llama.cpp) documentation, there are three variants:

- S (Small): Uses single quantization throughout
  Example using Q3_K_S:
  ```
  All model tensors → Q3_K (3-bit)
  Result: 2.75GB size, 6.46 perplexity (7B model)
  ```

- M (Medium): Strategic mixed precision
  Example using Q3_K_M:
  ```
  attention.wv, attention.wo, feed_forward.w2 → Q4_K (4-bit)
  All other tensors → Q3_K (3-bit)
  Result: 3.06GB size, 6.15 perplexity (7B model)
  ```

- L (Large): Higher precision mix
  Example using Q3_K_L:
  ```
  attention.wv, attention.wo, feed_forward.w2 → Q5_K (5-bit)
  All other tensors → Q3_K (3-bit)
  Result: 3.35GB size, 6.09 perplexity (7B model)
  ```

These strategies target attention and feed-forward layers with higher precision because they directly impact text processing quality, as demonstrated by the perplexity improvements in benchmarks: Q3_K_S (6.46) → Q3_K_M (6.15) → Q3_K_L (6.09).  
The improvement in perplexity scores demonstrates why mixed precision strategies are effective, though they require more storage space.


## Comprehensive Performance Comparison (7B model)
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

All data from [llama.cpp](https://github.com/ggerganov/llama.cpp/pull/1684) performance benchmarks and [GGML](https://github.com/ggerganov/ggml) implementation details.


## Memory Requirements for Inference
When running quantized models, you'll need more RAM than the model size alone for inference overhead. Memory requirements depend on several factors:
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

For larger models scale the memory requirements proportionally and ensure additional overhead memory is available for inference. Test with smaller models first to gauge your system's capabilities.

Note: Actual RAM/VRAM requirements will be higher than the model size. Consider monitoring memory usage during inference to determine exact requirements for your specific setup.


## Conclusion
Modern quantization techniques offer multiple ways to run large language models on consumer hardware. Here's what you need to remember:

- K-quantization provides the best balance through super-blocks and mixed precision strategies
- Q4_K_S (4-bit) represents the current sweet spot for most users, offering:
  - 3.7x size reduction
  - Good perplexity (6.02)
  - Excellent inference speed on both GPU and CPU
- For more constrained setups, Q2_K/Q3_K variants can run larger models with acceptable quality loss
- Higher bits (Q5_K, Q6_K) approach F16 quality but require more memory
- The _S/_M/_L variants let you fine-tune the quality-size tradeoff by adjusting precision where it matters most

Before downloading a quantized model, check your available RAM and choose a format that leaves enough memory for comfortable operation. For most users with modern GPUs, Q4_K variants will provide the best experience.

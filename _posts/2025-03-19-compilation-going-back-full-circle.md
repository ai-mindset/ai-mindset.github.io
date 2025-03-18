---
layout: post
title: "📦 From Compilation to Containerisation and Back Again"
date: 2025-03-19
tags: [deno, typescript, deployment, cross-platform, evolution, toolchain, best-practices, code-quality]
---
<!--more-->

## Introduction

Over the years, I've experimented with numerous programming languages and deployment strategies. Python has been my domain's lingua franca -with its vast ecosystem for data science and AI applications. However, its deployment complexities have consistently been a pain point: managing dependencies, configuring containers, and setting up build pipelines.  
This search for a better alternative has led me through statically compiled languages like Go and Rust; JIT-compiled languages like Julia; and hosted languages like Clojure and Scala. Yet most failed to provide a good balance between ecosystem richness and deployment simplicity. Recently, however, Deno 2.0 has emerged as a compelling solution -particularly with its ability to compile TypeScript (TS) / JavaScript (JS) to standalone executables.

## The Circular Evolution of Programming Languages

Programming languages have undergone a fascinating evolution. In the beginning (the late 1950s and 1960s), languages like Fortran, COBOL, and C were ahead-of-time compiled -transformed directly into machine code executables that could run without additional dependencies.  
As computing evolved, the pendulum swung toward higher-level languages -interpreted languages like Python and hosted environments like the JVM- prioritising readability and developer productivity over raw performance. These languages abstracted away machine-level concerns, allowing developers to focus on solving business problems.  
Yet this shift introduced new challenges. Python applications often require managing complex dependency trees, virtual environments, and platform-specific configurations. The infamous "_works on my machine_" problem became so pervasive that containerisation emerged as a solution.  
While effective, containerisation introduces its own complexities: orchestration, image management, and networking configurations. What began as a solution to simplify deployment has become a complex system requiring specialised knowledge.

## Deno: Compilation Makes a Comeback

Deno 2.0 represents a return to first principles. As highlighted in the [Run JavaScript Anywhere](https://youtube.com/watch?v=ZsDqTQs3_G0) video, its `compile` command enables developers to transform JS and TS programs into standalone binaries that run across major platforms -no runtime installation or dependencies required.

```typescript
// sample.ts
import { open } from "https://deno.land/x/open/index.ts";

// Open a URL in the default browser
await open("https://example.com");
```

With a simple `deno compile sample.ts` command, this code becomes a standalone executable that works on any machine without requiring Deno to be installed.  
This compilation process isn't traditional transpilation to machine code -it embeds your JS and TS code into a specialized Deno runtime binary (denort). Your script and dependencies are bundled as an EZIP file and injected into the runtime binary, creating a self-contained executable that can be code-signed for distribution.

The key benefits include:
1. **Cross-platform compatibility** without runtime requirements
2. **Simplified deployment** with single-binary distribution
3. **Bundled assets** for complete portability
4. **Improved startup times** compared to interpreter-based approaches

Deno 2.0 enhances these capabilities further with support for npm packages, web workers, cross-compilation, smaller binary sizes, and code signing with custom icons—making it viable for complete applications, not just scripts.

## The Single Language Advantage

Beyond deployment simplicity, using a single language across an entire project stack creates significant organisational benefits. I've experienced first-hand how using different languages for front-end, back-end, and data science work can create silos within teams.  
[Amplified's case study](https://dockyard.com/blog/2024/02/06/5-benefts-amplified-saw-switching-to-elixir) demonstrates this point clearly. After switching from a React/JS front-end and Phoenix/Elixir back-end to an all-Elixir approach with LiveView, they reported:

1. **Halved server costs** through more efficient resource utilisation
2. **Dramatically increased development speed** by eliminating cross-language silos
3. **Improved team cohesion** with shared tooling and knowledge
4. **Enhanced maintainability** through code reuse
5. **Reduced team size requirements** from 12 developers to just 2

TS with Deno provides a similar single language opportunity -allowing teams to build front-end interfaces, back-end services, and data processing workflows with the same toolchain. The JS/TS ecosystem is rapidly maturing for AI, ML, and data science applications, as I noted in my previous article on [Modern Data Science and AI Engineering with Deno 2.0]({{ site.baseurl }}{% link _posts/2024-09-05-deno.md %}).  
One often overlooked benefit is the reduced cognitive load when developers don't need to context-switch between different language paradigms, package managers, testing frameworks, and debugging approaches.

## Practical Applications

Deno's compilation capabilities shine in several real-world scenarios:

1. **CLI Tools**: Creating self-contained executables that "just work" across platforms without complex installation instructions
2. **Offline Environments**: Deploying to systems without internet access, where package resolution at runtime isn't possible
3. **Cross-Platform Applications**: Building desktop applications that leverage web technologies without requiring a browser runtime

## Conclusion

We've come full circle in programming language evolution -from compiled languages like Fortran in the 1950s, to interpreted languages for improved developer experience, to containerisation for managing deployment complexities, and now back to compilation with Deno[^1].  
Deno's approach represents a compelling blend—combining deployment simplicity with the ecosystem richness of modern TS/JS. For AI engineering, this addresses many pain points of Python deployment while maintaining access to growing ecosystem of data science tools.  
While Elixir offers similar single language benefits, its distribution story remains a work in progress with projects like [Burrito](https://github.com/burrito-elixir/burrito) showing promise but not yet fully mature. Until then, Deno stands out as a viable alternative for simplified deployment without sacrificing ecosystem benefits.  
The future of deployment may look surprisingly like its past, just with better languages and tools at our disposal -offering a path toward more cohesive, efficient software development that reduces complexity without sacrificing capability.

---
[^1]: Go, Zig, Rust, C/C++ D, Nim, Common Lisp are some prominent examples of ahead-of-time compiled languages that -with the exception of Common Lisp- excel in systems programming. However, Deno allows a ubiquitous, higher-level language like JS and its superset TS to join the compiled languages club. 

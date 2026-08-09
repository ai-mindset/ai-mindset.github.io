---
layout: post
title: "📝 From Vim to VSCode to Neovim"
date: 2024-12-24
tags: [
  minimal,
  cross-platform,
  toolchain,
  best-practices,
  design-principles,
  python,
  deno,
  zero-config,
]
---

**TL;DR:** After encountering keyboard-input failures with VS Code on my Fedora
setup, I returned to a lighter editor and built a Neovim configuration for
Python, Deno and Clojure. Neovim suits my preference for portable text
configuration, but this is a personal workflow account rather than a general
comparison of editor reliability.

<!--more-->

## Introduction

Vim's portable `.vimrc` embodies software minimalism at its best. One file, one
minute to setup, resulting in a complete development environment. This
simplicity served me well until Azure development motivated the use of VSCode.\
While VSCode worked reasonably well on macOS, Fedora revealed its constraints:
keyboard input failures, heavy resource usage, and
[complex environment portability](https://stackoverflow.com/questions/35368889/how-can-i-export-settings)
compared to Vim's `vim +PlugInstall`. These limitations drove my search for
tools that could maintain simplicity while meeting my development requirements
with simplicity and portability in mind.

## Vim -> VSCode -> Neovim

Azure development initially pulled me into VSCode's ecosystem. While stable on
macOS, Fedora revealed deal-breakers: random keyboard input failures that only
responded to command palette (Ctrl+Shift+P). No amount of configuration resets
or reinstalls resolved these issues.

This instability, coupled with VSCode's resource footprint, led me to Neovim.
The timing aligned with my exploration of Clojure, where Neovim's Conjure plugin
offered a compelling Lisp development experience that rivaled Emacs.

My requirements were specific:

- A lightweight Python IDE
- A lightweight Deno IDE
- A lightweight Clojure IDE

Through [Dialogue Engineering](/posts/dialogue-engineering.html), I crafted a
complete IDE using a
[single configuration file](https://github.com/ai-mindset/init.vim). Neovim's
mixed ecosystem of package managers and dual Vimscript/Lua support presents a
learning curve, but the resulting environment is fast, stable, and precisely
tailored to my needs. One minor drawback is the complexity of adding colour to
Conjure's output, especially when compared with the rich REPL experiences
offered by [IPython](https://ipython.org/), [Deno](https://deno.com/), and
Clojure with [rebel-readline](https://github.com/bhauman/rebel-readline).

## Conclusion

The journey from Vim to VSCode and finally to Neovim reflects a common pattern
in software development: sometimes we need to step backward to move forward.
While VSCode offered modern IDE features, its stability and resource issues on
Linux highlighted the enduring value of minimal, portable tools.\
For my workflow, Neovim preserves the parts of Vim I value while adding the
language-aware features I need. The cost is maintaining plugins and
configuration, which may be less attractive than a ready-made IDE for another
developer. The useful lesson is to evaluate an editor against real work and
maintenance effort, not to assume that lighter or newer is inherently better.

---
layout: post
title: "📖 Python To TypeScript Cheatsheet"
date: 2024-09-06
tags: [python, typescript, cheatsheet]
---

**TL;DR:** This compact reference guide provides side-by-side comparisons of
Python and TypeScript syntax for common programming constructs including
variable declarations, functions, classes, control flow structures, and error
handling-serving as a quick reference for Python developers exploring TypeScript
within the context of Deno development.
<!--more-->

## Introduction

I've been curious as to how Python and TypeScript compare at a high level, for
someone new to TypeScript. Below is a chatsheet I put together with the help of
Claude 3.5 Sonnet. It covers basic syntax, it's by no means complete or
exhaustive. However it gives a first taste of the similarities and differences
between the two languages. The reason I am looking into TypeScript is explained
in my [Deno article](../deno/).

## Variables And Data Types

| Concept | Python                                 | TypeScript                                                               |
| ------- | -------------------------------------- | ------------------------------------------------------------------------ |
| Int     | `x = 5`                                | `let x: number = 5;`                                                     |
| Float   | `y = 3.14`                             | `let y: number = 3.14;`                                                  |
| Str     | `name = "John"`                        | `let name: string = "John";`                                             |
| Bool    | `is_valid = True`                      | `let isValid: boolean = true;`                                           |
| List    | `numbers = [1, 2, 3]`                  | `let numbers: number[] = [1, 2, 3];`                                     |
| Dict    | `person = {"name": "John", "age": 30}` | `let person: { name: string; age: number } = { name: "John", age: 30 };` |

## Functions

| Concept     | Python                         | TypeScript                               |
| ----------- | ------------------------------ | ---------------------------------------- |
| Func def    | `def greet(name: str) -> str:` | `function greet(name: string): string {` |
| Func return | `return f"Hello, {name}!"`     | ``return `Hello, ${name}!`;``            |
| Lambda      | `lambda x: x * 2`              | `(x: number): number => x * 2`           |

## Classes

| Concept       | Python                                     | TypeScript                                 |
| ------------- | ------------------------------------------ | ------------------------------------------ |
| Class def     | `class Person:`                            | `class Person {`                           |
| Constructor   | `def __init__(self, name: str, age: int):` | `constructor(name: string, age: number) {` |
| Instance vars | `self.name = name`                         | `this.name = name;`                        |
|               | `self.age = age`                           | `this.age = age;`                          |
| Method def    | `def greet(self) -> str:`                  | `greet(): string {`                        |
| Method return | `return f"Hello, I'm {self.name}!"`        | ``return `Hello, I'm ${this.name}!`;``     |

## Control Flow

| Concept    | Python               | TypeScript                      |
| ---------- | -------------------- | ------------------------------- |
| If         | `if x > 0:`          | `if (x > 0) {`                  |
| Else if    | `elif x < 0:`        | `} else if (x < 0) {`           |
| Else       | `else:`              | `} else {`                      |
| For loop   | `for i in range(5):` | `for (let i = 0; i < 5; i++) {` |
| While loop | `while x > 0:`       | `while (x > 0) {`               |

## Error Handling

| Concept      | Python                      | TypeScript          |
| ------------ | --------------------------- | ------------------- |
| Try          | `try:`                      | `try {`             |
| Except/Catch | `except ZeroDivisionError:` | `} catch (error) {` |
| Finally      | `finally:`                  | `} finally {`       |

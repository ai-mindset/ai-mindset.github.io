# Python to TypeScript cheatsheet

I've been curious as to how Python and TypeScript compare at a high level, for someone new to TypeScript. Below is a chatsheet I put together with the help of Claude 3.5 Sonnet. It covers basic syntax, it's by no means complete or exhaustive. However it gives a first taste of the similarities and differences between the two languages. The reason I am looking into TypeScript is explained in my [Deno article]({% link _posts/2024-09-05-deno.md %}).

## Variables and Data Types

| Concept | Python | TypeScript |
|-|-|-|
| Int | `x = 5`| `let x: number = 5;`|
| Float | `y = 3.14`| `let y: number = 3.14;`|
| Str | `name = "John"`| `let name: string = "John";`|
| Bool | `is_valid = True`| `let isValid: boolean = true;`|
| List | `numbers = [1, 2, 3]`| `let numbers: number[] = [1, 2, 3];`|
| Dict | `person = {"name": "John", "age": 30}`| `let person: { name: string; age: number } = { name: "John", age: 30 };`|

## Functions 

| Concept | Python | TypeScript |
|-|-|-|
| Func def | `def greet(name: str) -> str:`| `function greet(name: string): string {`|
| Func return | `return f"Hello, {name}!"`| ``return `Hello, ${name}!`;``|
| Lambda | `lambda x: x * 2`| `(x: number): number => x * 2`|

## Classes

| Concept | Python | TypeScript |
|-|-|-|
| Class def | `class Person:`| `class Person {`|
| Constructor | `def __init__(self, name: str, age: int):`| `constructor(name: string, age: number) {`|
| Instance vars | `self.name = name`| `this.name = name;`|
| | `self.age = age`| `this.age = age;`|
| Method def | `def greet(self) -> str:`| `greet(): string {`|
| Method return | `return f"Hello, I'm {self.name}!"`| ``return `Hello, I'm ${this.name}!`;``|

## Control Flow

| Concept | Python | TypeScript |
|-|-|-|
| If | `if x > 0:`| `if (x > 0) {`|
| Else if | `elif x < 0:`| `} else if (x < 0) {`|
| Else | `else:`| `} else {`|
| For loop | `for i in range(5):`| `for (let i = 0; i < 5; i++) {`|
| While loop | `while x > 0:`| `while (x > 0) {`|

## Error Handling

| Concept | Python | TypeScript |
|-|-|-|
| Try | `try:`| `try {`|
| Except/Catch | `except ZeroDivisionError:`| `} catch (error) {`|
| Finally | `finally:`| `} finally {`|


## Procedural or OO?
Both languages are Object-Oriented first, allowing for different programming paradigms such as procedural or functional to an extent. Depending on a technologist's background and preference, some people may gravitate towards one paradigm over another. I've found that frequently enough, software developers[^1] may tend to become polarised and strongly support or oppose a programming paradigm or style. More often than not, I've found this to be due to personal opinions and preferences without adequate substantiation.  
Personally, given my technical needs, I've found Object-Orientation not to be required or sometimes adding unnecessary opaqueness. For this reason, I usually opt for procedural programming. Here's my rationale: 

1. Pure Functions
- Each function has a single responsibility
- Functions are independent and don't share state
- All dependencies are passed as parameters
- Functions are easier to test and reason about

2. No Class State
- Configuration is passed explicitly to functions
- No instance variables to manage
- No need to worry about this context
- Clearer data flow between functions

3. Enhanced Features  
- Added batch operations support -no need to maintain state  
- Added filtered search capability -no hidden state  
- Better type definitions  
- More explicit error handling -no shared state    

4. Testing Advantages
- Functions can be tested in isolation
- No need to mock class instances
- Easier to unit test each function
- Simpler dependency injection

A final thought, I recognise and appreciate how succinct and effective functional programming can be. Thus, I'm striving to shift my coding style to be more functional.  

[^1]: Software is _not_ an engineering discipline. See the definition of [engineer](https://dictionary.cambridge.org/dictionary/english/engineering) for more information

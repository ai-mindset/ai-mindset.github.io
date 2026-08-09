---
layout: post
title: "💡 TIL: Pydantic, Python's Data Validation Guard"
date: 2024-11-26
tags: [
  til,
  data-validation,
  python,
  type-checking,
  data-modeling,
  code-quality,
  pydantic,
  error-handling,
]
---

**TL;DR:** Pydantic uses Python type annotations to parse and validate runtime
data. It can reduce boundary-validation boilerplate and produce structured
errors, but coercion and validation behaviour must be configured deliberately
rather than assumed from type hints alone.

<!--more-->

## Introduction

Today I started using [Pydantic](https://docs.pydantic.dev/latest/), a Python
library for parsing and validating data with type annotations. It is
particularly useful at boundaries such as API payloads, settings and imported
records. Validation can catch some errors early, while Pydantic's coercion rules
and strict modes determine whether an unexpected value is converted or rejected.

## Understanding Pydantic and Its Value

Pydantic uses Python's type annotations to define parsing and validation rules
for models. The checks apply where a model is constructed; they do not enforce
consistency throughout an application automatically.

### Type Enforcement

```python
from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int
    email: str

# This raises a ValidationError
user = User(name="John", age="not_a_number", email="john@example.com")
```

### Automatic Type Coercion

```python
class Order(BaseModel):
    quantity: int
    price: float

# Pydantic automatically converts valid strings to numbers
order = Order(quantity="3", price="9.99")
print(order.quantity)  # 3 (int)
print(order.price)    # 9.99 (float)
```

### Real-World Benefits

- **API Development**: Validates incoming JSON data automatically
- **Configuration Management**: Ensures config files meet your specifications
- **Database Operations**: Validates data before insertion
- **Data Parsing**: Converts between JSON, dictionaries, and model instances
  seamlessly

### Why It Matters

1. **Error Prevention**: Catches data issues at system boundaries
2. **Clean Code**: Reduces validation boilerplate
3. **Inspectable schemas**: Type annotations can support validation rules,
   documentation and generated schemas
4. **Structured errors**: Callers can identify which fields failed and why

## Conclusion

Pydantic is most valuable at system boundaries, where untrusted or loosely typed
input becomes an internal model. It can reduce boilerplate and make failures
clearer, but the schema, coercion policy and custom validators still need tests.
A successfully constructed model means that its declared validation passed, not
that the data is true or suitable for the business decision.

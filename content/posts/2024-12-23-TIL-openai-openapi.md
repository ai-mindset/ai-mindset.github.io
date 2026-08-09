---
layout: post
title: "💡 TIL: Exploring OpenAI's API with Swagger"
date: 2024-12-23
tags: [ai, llm, openai, openapi, spec]
---

**TL;DR:** OpenAI publishes a machine-readable OpenAPI specification. Loading
its YAML file into an OpenAPI viewer such as Swagger UI makes endpoints and
schemas easier to browse. Treat the specification and official API documentation
as the sources of truth; interactive requests may still need credentials and
compatible browser security settings.

<!--more-->

## Introduction

OpenAI maintains an
[OpenAPI specification](https://github.com/openai/openai-openapi/) for its REST
API. A useful way to inspect the machine-readable document is through Swagger's
web interface.

## The Discovery

You can browse the
[OpenAPI YAML file](https://github.com/openai/openai-openapi/blob/main/openapi.yaml)
directly or load its raw URL into
[Swagger UI](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/openai/openai-openapi/main/openapi.yaml#/).

## Why This Matters

This approach offers several advantages:

- Interactive exploration of all API endpoints
- Complete request/response schemas
- A "try it" interface where authentication, CORS and endpoint policy permit it
- Detailed parameter documentation

For developers working with AI APIs, this provides a valuable reference point -
especially when building services that need to maintain compatibility with
OpenAI's API structure.

## Try It Yourself

Visit the [Swagger UI](https://petstore.swagger.io/) and paste this URL:\
`https://raw.githubusercontent.com/openai/openai-openapi/main/openapi.yaml`

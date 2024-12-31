---
layout: post
title: "💡 TIL: Exploring OpenAI's API with Swagger"
date: 2024-12-23
tags: [ai, llm, openai, openapi, spec]
---
<!--more-->

## Introduction 
OpenAI maintains a comprehensive [OpenAPI specification](https://github.com/openai/openai-openapi/) that documents their entire API surface. While browsing through their GitHub repository, [Simon Willison](https://simonwillison.net/)[^1] discovered you can easily explore this spec using Swagger's web interface.

## The Discovery
Willison recently highlighted a neat trick: you can browse OpenAI's full API documentation by loading their [OpenAPI YAML file](https://github.com/openai/openai-openapi/blob/master/openapi.yaml) directly into [Swagger's web UI](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/openai/openai-openapi/refs/heads/master/openapi.yaml#/).

## Why This Matters
This approach offers several advantages:
- Interactive exploration of all API endpoints
- Complete request/response schemas
- Built-in testing capability
- Detailed parameter documentation

For developers working with AI APIs, this provides a valuable reference point - especially when building services that need to maintain compatibility with OpenAI's API structure.

## Try It Yourself
Visit the [Swagger UI](https://petstore.swagger.io/) and paste this URL:   
`https://raw.githubusercontent.com/openai/openai-openapi/refs/heads/master/openapi.yaml`

---
[^1]: Co-founder of [Lanyrd](https://blog.natbat.net/post/61658401806/lanyrd-from-idea-to-exit), co-creator of [Django](https://simonwillison.net/2005/Jul/17/django/) and [Datasette](https://datasette.io/) and a prolific independent AI researcher

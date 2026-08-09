---
layout: post
title: "🖥 The On-Prem Comeback (aka Cloud Repatriation)"
date: 2024-11-14
tags: [cloud, on-prem, infrastructure, retrospective]
---

**TL;DR:** Cloud repatriation means moving selected workloads from public cloud
services to owned or privately operated infrastructure. It can improve cost or
control for a stable, well-understood workload, but it also transfers capacity
planning, maintenance and operational risk to the organisation. Treat prominent
migrations as case studies, not a universal trend or prescription.

<!--more-->

## Introduction

Some organisations have moved particular workloads away from public cloud
providers such as AWS, Google Cloud and Azure. The word "repatriation" can make
that sound like a wholesale reversal, although most infrastructure portfolios
remain mixed.

## What Does Cloud Repatriation Mean?

Cloud repatriation refers to moving applications, services or data from a public
cloud to on-premises infrastructure, colocation or a private cloud. A company
can repatriate one steady workload while continuing to use managed cloud
services elsewhere.

## Why It's Happening

A credible decision starts with the workload rather than the slogan. Predictable
utilisation may make owned hardware economical; elastic or short-lived demand
may favour rented capacity. Latency, data location, specialised managed
services, staffing, failure recovery and the cost of idle capacity also belong
in the comparison.

[37signals reported](https://world.hey.com/dhh/our-cloud-exit-savings-will-now-top-ten-million-over-five-years-c7d9b5bd)
substantial projected savings from its own cloud exit. That is useful evidence
about one company's scale, architecture and staffing, not a forecast for another
organisation. The relevant calculation is a measured total cost of ownership for
a representative workload, including people and risk.

## Conclusion

Cloud and owned infrastructure are operating models, not identities. Start with
a reversible pilot, record a baseline for cost and service quality, and include
the migration and exit costs. A later
[review of cloud repatriation evidence and decisions](/posts/cloud-repatriation-trends-implications.html)
develops that framework in more detail.

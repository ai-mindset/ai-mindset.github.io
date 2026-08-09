---
layout: post
title: "🏠 When Cloud Repatriation Makes Sense"
date: 2025-03-20
tags: [
  cloud,
  on-prem,
  performance,
  security,
  mlops,
  deployment,
  best-practices,
  decision-making,
]
---

**TL;DR:** Cloud repatriation is the selective movement of workloads from public
cloud services to owned or privately operated infrastructure. Surveys show that
many organisations have moved at least some workloads, but this is usually
portfolio adjustment rather than a wholesale cloud exit. Compare total cost,
demand variability, latency, data controls and operational capability for each
workload.

<!--more-->

## Introduction

Public cloud services make experimentation, rapid scaling and managed
infrastructure accessible without buying hardware first. Those benefits do not
make every workload an efficient permanent tenant. As systems mature and demand
becomes predictable, some organisations reconsider where particular applications
and data should run.

That reconsideration is cloud repatriation. I introduced the term in
[The On-Prem Comeback](/posts/cloud-repatriation.html); this article turns it
into a decision framework.

## What the Reported Trend Does and Does Not Mean

A [Rackspace 2025 survey](https://ir.rackspace.com/node/12486/pdf) reported that
69% of respondents had moved at least some workloads from public cloud to
private cloud or on-premises infrastructure. A
[Puppet overview](https://www.puppet.com/blog/cloud-repatriation) cites other
surveys showing selective repatriation alongside continued hybrid-cloud use.

These figures require care. They describe organisations, not the percentage of
workloads moved, and vendor surveys can reflect their sample and question
wording. Moving one unsuitable database qualifies an organisation as having
repatriated something. It does not imply that public cloud adoption is reversing
as a whole.

The useful conclusion is modest: placement is no longer a one-way decision.

## The Workload Test

### 1. Is Demand Predictable?

Owned capacity becomes easier to justify when utilisation is high and steady.
Public cloud remains attractive for uncertain products, short-lived experiments,
bursty demand and services whose managed capabilities would be costly to
reproduce.

Do not compare an on-demand list price with a server purchase alone. Compare
realistic commitments, discounts and utilisation on both sides.

### 2. What Is the Total Cost?

A five-year comparison should include:

- Compute, storage, requests, data transfer and support
- Hardware purchase, financing and refresh
- Racks, power, cooling, networking and spare capacity
- Backups, disaster recovery and a second failure domain
- Staff time for provisioning, patching, observability and incidents
- Migration work, contract commitments and exit costs

37signals provides a useful case study, not a universal ratio. David Heinemeier
Hansson reported that its
[projected five-year savings exceeded $10 million](https://world.hey.com/dhh/our-cloud-exit-savings-will-now-top-ten-million-over-five-years-c7d9b5bd)
after moving stable SaaS workloads to hardware in existing data-centre capacity.
The existing racks, experienced operations team and predictable demand are part
of the result, not incidental details.

### 3. Where Does Latency Come From?

Moving compute closer to a factory, instrument, market or large local dataset
can reduce network latency and transfer cost. It can also make latency worse if
users are globally distributed and the new system has fewer regions or weaker
connectivity.

Measure the end-to-end path. Hardware benchmark results alone do not describe
application latency.

### 4. Which Controls Are Required?

Regulation may constrain data location, access, retention and auditability. Both
cloud and privately operated systems can satisfy strong controls, and both can
be misconfigured. Direct ownership provides control only if the organisation has
the processes and expertise to exercise it.

Security is therefore not a generic argument for either location. Compare the
actual threat model, responsibilities and evidence.

### 5. Can the Team Operate It?

Managed databases, queues, identity systems and object stores embody substantial
operational work. Replacing a virtual machine is much easier than replacing all
the surrounding guarantees.

Before moving, test whether the team can handle capacity planning, hardware
failure, patching, recovery, monitoring and on-call support.
[HPE's cloud-repatriation overview](https://www.hpe.com/us/en/what-is/cloud-repatriation.html)
also treats capacity planning and a comprehensive migration plan as
prerequisites rather than afterthoughts.

## A Small Decision Table

| Workload characteristic | Public cloud tends to help                    | Owned or private infrastructure may help      |
| ----------------------- | --------------------------------------------- | --------------------------------------------- |
| Demand                  | New, uncertain or highly bursty               | Stable and consistently high                  |
| Geography               | Many regions or edge locations                | Concentrated users or local equipment         |
| Data movement           | Modest or mostly within one provider          | Persistent high-volume transfer or local data |
| Managed services        | Heavy reliance on provider-specific platforms | Mostly portable, well-understood components   |
| Operations              | Small team avoiding infrastructure ownership  | Existing team, facilities and automation      |
| Time horizon            | Short experiment or rapidly changing product  | Long-lived workload with predictable growth   |

This table suggests where to investigate; it does not calculate the answer.

## Run a Reversible Pilot

A low-risk repatriation starts with one bounded workload:

1. Record a baseline for cost, latency, reliability and staff time.
2. Include migration and dual-running costs in the comparison.
3. Build backup and recovery before moving production traffic.
4. Shift traffic gradually and define rollback criteria.
5. Measure at least one representative demand cycle.
6. Keep interfaces and data exports portable enough to move again.

Optimising placement once should not create a new form of lock-in.

## Personal Infrastructure

The same reasoning applies at home on a smaller scale. Self-hosting can improve
control and make use of existing hardware, but it transfers responsibility for
backups, security updates, remote access and hardware failure. A local photo
library without an off-site recovery copy is not a privacy win if one failed
disk destroys it.

## Conclusion

Cloud repatriation is best understood as workload placement, not a movement to
join. Public cloud, colocation, private cloud and local machines are tools with
different cost curves and operational demands.

The valuable question is not "cloud or on-premises?" It is "what evidence shows
that this workload belongs here, and how easily can we change our mind?"

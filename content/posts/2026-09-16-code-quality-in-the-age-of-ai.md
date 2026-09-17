---
layout: post
title: "🧭 Code Quality in the Age of AI: From Clean Code to Sound Decisions"
date: 2026-09-16
tags: [
  ai,
  software-engineering,
  code-quality,
  testing,
  governance,
  systems-thinking,
]
---

**TL;DR:** AI makes implementation faster. Engineers still have to choose the
right problem, weigh trade-offs and prove that a change behaves correctly
across a system. Their biggest contribution lies in sound decisions,
system-level reasoning, executable guardrails and continuous evidence.

<!--more-->

## Introduction

In the IBM Technology video
[Code Quality in the Age of AI: Why Great Code Isn't Enough](https://youtu.be/GRYZR2R20FI),
Meenakshi Kodati explains how AI is changing software engineering. Questions
about languages, frameworks and coding style now sit beside questions such as:
should AI write this code, can I trust this pull request, and do I need to
implement this myself?

Kodati focuses on the decisions around the code. When implementation becomes
cheap and fast, the hard part is deciding what ought to be implemented, how it
should fit into a wider system and what evidence should be required before
trusting it.

## AI Changes the Bottleneck

[AI can now produce hundreds of lines of code in seconds](https://youtu.be/GRYZR2R20FI?t=21),
turn a feature that once took days into an afternoon prototype, remove much of
the boilerplate, draft documentation and suggest unit tests. Once the code
exists, the developer's attention turns to what happens next.

Writing syntax is only one part of the job. The difficult part is
building the right solution to a business problem and making sure the software
produces the intended outcome. Lines generated, tickets closed and prototype
speed say little about AI's value. Whether the resulting
software helps the people or organisation using it, is the more meaningful measure.

The quality of the result starts with the quality of the requirement. AI gets a
well-framed problem to a useful result sooner and rushes a poorly framed one in
the wrong direction.

## Code Quality Starts with the Decision

The familiar properties of good code remain useful:

- Readability
- Maintainability
- Reliability
- Efficiency
- Modularity
- Testability
- Adherence to appropriate design principles

Readable names, clean interfaces and attention to code smells keep software
understandable, testable and maintainable. The first quality question is
[whether this is the right solution](https://youtu.be/GRYZR2R20FI?t=109).

Given a well-defined problem, an AI assistant can often produce clean, working
code quickly. Architectural choices demand years of business context, an
understanding of operational complexity and a view of the whole system. In the
video's terms, **implementation quality is becoming easier to obtain, while
decision quality is becoming the differentiator**.

Engineers spend more of their time on those decisions. They remain accountable
for trade-offs, governance, security, reliability and long-term maintainability,
irrespective of who or what typed the code.

## Engineering the Whole Feature

The video's notification-feature example makes the distinction concrete. An AI
assistant could quickly generate an API endpoint, database schema, queue
consumer and front-end integration. Once those artefacts exist, an experienced
engineer needs to ask:

- Should the design be event-driven?
- Should notifications be synchronous or asynchronous?
- What happens when a downstream service is unavailable?
- How do retries work, and how are duplicate deliveries handled?
- What is the effect on latency?
- What changes when the system grows from 10,000 users to 10 million?
- Is the feature solving the customer's actual problem?
- Are we optimising for speed, cost, reliability or user experience?
- How will we know whether the feature succeeded?

These [engineering and product decisions](https://youtu.be/GRYZR2R20FI?t=273)
shape software quality more profoundly than whether a variable matches the
style guide.

A precise prompt records the constraints already known. Finding missing
constraints, surfacing failure modes and choosing the right measure of success
remain engineering work. AI can help explore those questions; the engineer
owns the decision.

## Code Review Must Expand to the System

Traditional pull-request review encourages a file-by-file view: inspect the
diff, leave comments, approve and merge. Modern software crosses file and
repository boundaries. A small code change may affect APIs, infrastructure,
event streams, data contracts, cloud resources, monitoring, security policies
and downstream services.

A review needs to answer two questions: _is this function correct?_ and
[_what impact will this change have across the platform?_](https://youtu.be/GRYZR2R20FI?t=354)
That means reasoning about the local diff, its interactions and its wider
consequences.

AI-assisted development can create a misleading impression here. A large pull
request may look polished, with consistent names, confident comments and
plausible abstractions. Those qualities make the diff easier to read. Evidence
must also show that the change preserves data contracts, degrades safely, fits
the architecture and behaves well under production load. System-level quality
depends on understanding the whole environment in which the code will run.

## Trust Behaviour Through Evidence

Testing becomes more important as code generation accelerates. The video calls
it [the primary proof of quality](https://youtu.be/GRYZR2R20FI?t=437). Tests
give a polished pull request evidence that the software behaves as intended.

Confidence should come from several complementary forms of validation:

- Unit tests for focused behaviour
- Integration tests for component interactions
- Contract tests for boundaries between systems
- Security validation
- Performance testing
- Runtime monitoring
- Observability that makes production behaviour understandable

Validated behaviour is the basis for trust, whether the code came from a
developer or a model.

Tests provide evidence for the cases and properties they exercise. If an AI
assistant generates both an implementation and tests from the same incomplete
assumption, both can agree and still be wrong. The engineer judges whether the
evidence covers the important requirements, boundaries and failure modes.

## Turn Standards into Executable Guardrails

Many engineering standards live in documents: a wiki page for naming, a
security checklist, an architecture guide or a coding-standard document that
everyone intends to read. They need regular maintenance, and delivery pressure
makes them easy to overlook.

In an AI-assisted workflow, the video argues that standards need to
[exist in the development process itself](https://youtu.be/GRYZR2R20FI?t=533):

- Enforce security requirements automatically
- Encode architectural guardrails in templates and tooling
- Make testing expectations part of every pull request
- Run static analysis continuously
- Express policies as executable checks

This puts governance inside the workflow and makes AI safer to use at scale.
Generated work then meets the same repeatable checks across teams. Those checks
turn team knowledge into instructions that both people and models can follow.

Good guardrails make the correct path the easiest path. Explicit boundaries
help both people and tools, while automated checks create fast feedback when a
change crosses one of those boundaries.

Automation works best where a rule can be stated and checked. Review and
judgement cover novel trade-offs, ambiguous product intent and unexpected
system interactions.

## Quality Must Be Continuous

Teams once concentrated quality work at the release checkpoint: complete a
final code review, obtain QA sign-off, work through a checklist and deploy.
Continuous delivery spread that work across the development cycle. AI increases
the rate of change further, so teams need evidence throughout the lifecycle.

Kodati describes
[quality as a continuous practice](https://youtu.be/GRYZR2R20FI?t=628):

- Every commit triggers validation
- Every pull request runs automated tests
- Every deployment produces observable signals
- Every production system supplies feedback for the next iteration

Quality is therefore woven through planning, implementation, deployment and
operations. This closes the loop between an intended change and its behaviour
in the real system and turns quality into an ongoing learning process.

## Judgement Is the Core Skill

The video closes with the skill that becomes more valuable as AI improves at
implementation: [judgement](https://youtu.be/GRYZR2R20FI?t=718). The engineers
best placed to thrive will combine technical depth with the ability to:

- Ask better questions before implementation begins
- Understand systems and the relationships between their components
- Recognise and communicate trade-offs
- Design resilient architectures
- Connect technical choices to business outcomes
- Know when to trust AI and when to challenge it

Experience and technical understanding make those abilities possible. They
help an engineer recognise a plausible but fragile solution, anticipate
second-order effects and demand the right evidence.

## A Practical Review Lens

The video's argument can be distilled into five questions that can be applied to
AI-assisted work:

1. **Outcome:** Are we solving the right problem, and how will success be
   measured?
2. **Decision:** Which architectural and product trade-offs were considered,
   and why was this option chosen?
3. **System:** Which contracts, services, data flows, policies and operational
   behaviours can the change affect?
4. **Evidence:** Which tests and production signals demonstrate the required
   behaviour, including failure cases?
5. **Guardrails:** Which important standards are enforced continuously through
   tooling?

These questions widen code review to cover the parts of software engineering
that a clean diff cannot show.

## Conclusion

AI is becoming very good at generating candidate solutions. The engineer's
responsibility is to decide whether they are the right solutions and to produce
evidence that they work in context.

Readable, maintainable and reliable code provides the foundation. Quality also
extends into problem selection, architecture, system effects, testing,
governance, operations and business outcomes. AI raises the premium on solving
problems thoughtfully.

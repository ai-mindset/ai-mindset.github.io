---
layout: post
title: "🏠 Why Companies and Individuals Are Moving Back from the Cloud"
date: 2025-03-20
tags: [cloud, on-prem, performance, security, mlops, deployment, best-practices, data-science]
---
<!--more-->

## Introduction

The last decade has witnessed the meteoric rise of cloud computing, with organisations large and small migrating their data, applications, and infrastructure to public cloud environments. The promises were compelling: reduced capital expenditure, unlimited scalability, enhanced flexibility, and access to cutting-edge technologies without the overhead of managing physical infrastructure. However, a notable countertrend has emerged in recent years -cloud repatriation. This phenomenon, sometimes referred to as "reverse cloud migration," involves moving workloads, applications, and data back from public cloud environments to on-premises data centres, private clouds, or hybrid setups ([TRG International, 2023](https://blog.trginternational.com/cloud-repatriation-business-return-on-premises)). I've previously explored this topic in my article [The On-Prem Comeback (aka Cloud Repatriation)]({{ site.baseurl }}{% link _posts/2024-11-14-cloud-repatriation.md %}), where I introduced the basic concepts and early examples of this trend.  
This article explores the growing cloud repatriation movement, examining why organisations and individuals are reconsidering their cloud-first strategies, the key drivers behind these decisions, and how they're implementing these transitions to achieve more balanced and optimised IT infrastructures.

## The Scale of the Cloud Repatriation Movement

The repatriation trend is not isolated but represents a significant shift in how organisations approach their IT infrastructure strategy. According to a 2021 survey by IDC cited by [TRG International](https://blog.trginternational.com/cloud-repatriation-business-return-on-premises), 80% of organisations reported repatriating workloads or data from public cloud environments. More recent data from the end of 2024 showed that 86% of CIOs planned to move some public cloud workloads back to private cloud or on-premises -the highest on record for the Barclays CIO Survey ([Puppet, 2025](https://www.puppet.com/blog/cloud-repatriation)).  
A recent survey by Rackspace found that nearly seven in 10 companies (69%) have moved at least some applications off the cloud and back to on-premise systems or private clouds ([ZDNet, 2025](https://www.zdnet.com/article/why-some-companies-are-backing-away-from-the-public-cloud/)).  
It's important to note that this doesn't represent a wholesale abandonment of cloud computing. Only about 8% of organisations are moving their entire workloads off the cloud, according to an October 2024 IDC survey ([Puppet, 2025](https://www.puppet.com/blog/cloud-repatriation)). Most are selectively repatriating specific workloads while maintaining others in the cloud, resulting in more nuanced, hybrid approaches to IT infrastructure.

## Key Drivers of Cloud Repatriation

### Cost Optimisation

While the cloud initially promised cost savings through reduced capital expenditure and operational flexibility, many organisations have experienced what industry experts call "bill shock" as their cloud usage scales. According to [TRG International](https://blog.trginternational.com/cloud-repatriation-business-return-on-premises), "a Gartner study predicts that through 2024, 60% of infrastructure and operations leaders will encounter public cloud cost overruns that negatively impact their on-premises budgets".  
This cost concern is particularly relevant for organisations with predictable, high-volume workloads. According to [RSA](https://www.rsa.com/resources/blog/identity-governance-and-administration/cloud-repatriation-why-enterprise-it-is-returning-from-the-cloud/), the company 37Signals announced that its "cloud exit" would save more than $10 million over five years. Similarly, a 2022 report by Andreessen Horowitz found that repatriation of cloud workloads could reduce cloud bills by 50% or more for some companies ([TRG International, 2023](https://blog.trginternational.com/cloud-repatriation-business-return-on-premises)).  
David Linthicum, a leading consultant and former CTO with Deloitte, attributes much of this cost issue to technical debt: "_They didn't refactor the applications to make them more efficient in running on the public cloud providers. So the public cloud providers, much like if we're pulling too much electricity off the grid, just hit them with huge bills to support the computational and storage needs of those under-optimized applications_" ([ZDNet, 2025](https://www.zdnet.com/article/why-some-companies-are-backing-away-from-the-public-cloud/)).

### Performance and Latency

Performance requirements are driving many repatriation decisions, particularly for applications requiring ultra-low latency. According to [TRG International](https://blog.trginternational.com/cloud-repatriation-business-return-on-premises), "a study by the IEEE found that for certain AI workloads, on-premises GPU clusters outperformed cloud-based solutions by up to 30% in terms of performance per dollar".  
This performance concern is especially critical in fields like financial trading, scientific research, and manufacturing where latency can significantly impact outcomes. As [ComputerWeekly](https://www.computerweekly.com/feature/Cloud-repatriation-How-to-do-it-successfully) notes, "time-sensitive data includes information that users need to access as rapidly as possible -think financial trading feeds -or where the application is sensitive to latency".

### Security and Compliance

Security concerns and regulatory compliance requirements are powerful motivators for cloud repatriation. According to the Rackspace survey cited by [ZDNet](https://www.zdnet.com/article/why-some-companies-are-backing-away-from-the-public-cloud/), data security and compliance concerns were the most common reason for repatriation, cited by 50% of respondents.   
The implementation of stringent regulations like GDPR has compelled many organisations to keep certain data within specific geographic boundaries. As [TRG International](https://blog.trginternational.com/cloud-repatriation-business-return-on-premises) highlights, "_The Data Protection Commission reported a 59% increase in GDPR complaints in 2022, underscoring the importance of data sovereignty_".  
Despite cloud providers' significant security investments, many organisations prefer to maintain direct control over their most sensitive data. According to [TRG International](https://blog.trginternational.com/cloud-repatriation-business-return-on-premises), "_a 2023 Thales Cloud Security Study found that 45% of businesses have experienced a cloud-based data breach or failed audit in the past 12 months, highlighting ongoing security concerns_".

### Control and Vendor Lock-in

The desire for greater control over hardware and software configurations, along with concerns about vendor lock-in, are also driving repatriation efforts. On-premises infrastructure offers more customisation possibilities that may not be available in public cloud environments.  
Richard Robbins, founder of TheTechnologyVault.com, observes that "_enterprises don't like being dependent upon someone else's cloud infrastructure_" ([ZDNet, 2025](https://www.zdnet.com/article/why-some-companies-are-backing-away-from-the-public-cloud/)). This concern is particularly acute among regulated industries such as financial institutions, which are "_moving some or all of their web apps from the cloud back to on-prem or to hybrid setups_" due to "vulnerability and downsides to cloud hosting" that make "executives feel nervous about not having more control".

## The Emergence of Balanced Approaches

Rather than a binary choice between cloud and on-premises, organisations are increasingly adopting hybrid and multi-cloud approaches that offer the best of both worlds. This trend allows organisations to:

- Keep sensitive or high-performance workloads on-premises
- Leverage cloud services for scalability and innovation
- Maintain flexibility to adapt to changing business needs

According to [TRG International](https://blog.trginternational.com/cloud-repatriation-business-return-on-premises), "_The hybrid cloud market is expected to grow from $85.3 billion in 2022 to $262.4 billion by 2027, according to MarketsandMarkets research_". Similarly, "_Flexera's 2023 State of the Cloud Report revealed that 71% of enterprises are pursuing a hybrid cloud strategy, combining public cloud, private cloud, and on-premises infrastructure_".

## Personal Cloud Repatriation

The repatriation trend isn't limited to enterprises. Individuals are also exploring self-hosting options for personal data.  
For example, [a fediverse user](https://hachyderm.io/@Jeffrey04/114175854454606516) recently posted about developing a self-hosted photo album application when faced with cloud storage limitations: "_Being an enthusiastic photographer, my partner captured moments of us together. However, the increasing stack of photos is accelerating the imminent explosion of my cloud storage_" ([KitFu Coda, 2023](https://kitfucoda.medium.com/a-love-story-in-code-building-my-self-hosted-photo-album-b56a4e89ebdd)). This personal project highlights how individuals with technical skills can leverage idle hardware to create cost-effective alternatives to cloud storage services.  
As [they note](https://kitfucoda.medium.com/a-love-story-in-code-building-my-self-hosted-photo-album-b56a4e89ebdd), "_Self-hosting your own data is becoming a trend these days, and it is really not hard to get started_". This trend parallels the enterprise movement, with individuals seeking greater control, cost savings, and privacy for their personal data.

## Planning for Successful Repatriation

For organisations considering cloud repatriation, careful planning is essential. Key considerations include:

1. **Workload Assessment**: Not all workloads benefit equally from repatriation. [ComputerWeekly](https://www.computerweekly.com/feature/Cloud-repatriation-How-to-do-it-successfully) advises that "_broadly, repatriation might be the best option where data is sensitive, time sensitive or expensive to store in the cloud_".
2. **Infrastructure Preparation**: Organisations must ensure they have the physical capacity, networking, power, and cooling capabilities to support repatriated workloads. According to [ComputerWeekly](https://www.computerweekly.com/feature/Cloud-repatriation-How-to-do-it-successfully), "_a large repatriation project might be a prompt to reorganise the datacentre, perhaps by moving to newer equipment that can pack more storage into a single rack or that consumes less power_".
3. **Skills Assessment**: [ComputerWeekly](https://www.computerweekly.com/feature/Cloud-repatriation-How-to-do-it-successfully) notes the importance of having "_enough staff to provision and manage a larger system_" with the necessary "_security and privacy skills needed to handle sensitive data_" and "_technical know-how to handle mission-critical, latency sensitive applications_".
4. **Future-Proofing**: [RSA](https://www.rsa.com/resources/blog/identity-governance-and-administration/cloud-repatriation-why-enterprise-it-is-returning-from-the-cloud/) emphasises the importance of maintaining flexibility: "_Organizations should consider the long-term implications of repatriation for their overall IT strategy. This includes planning for future scalability, considering how repatriation fits into the broader digital transformation initiatives, and ensuring that the new infrastructure aligns with long-term business goals_".

## Conclusion

Cloud repatriation represents a maturing perspective on IT infrastructure strategy rather than a rejection of cloud computing. As organisations gain experience with cloud environments, they're becoming more strategic about which workloads belong where, based on factors like cost, performance, security, and control.  
The future likely belongs to balanced, hybrid approaches that leverage the strengths of both cloud and on-premises infrastructure. As [Puppet](https://www.puppet.com/blog/cloud-repatriation) notes, "_Cloud repatriation is not an endpoint, but rather a strategic tool in the ongoing evolution of enterprise IT. It empowers organizations to take control of their digital assets, enhance their security posture, and align their technology infrastructure with their business objectives_".  
For both organisations and individuals, the key is making informed decisions about where and how to deploy IT resources based on specific needs rather than following blanket "cloud-first" or "on-premises-first" policies. This nuanced approach to infrastructure strategy will likely characterise the next phase of digital transformation as the industry moves beyond the initial hype cycles of cloud adoption.

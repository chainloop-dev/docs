---
title: Introducing ChainLoop
slug: introducing-chainloop
authors: miguel
image: /img/v2/chainloop-dev-overview.png
---

If you have ever worked at a company that leverages CI/CD systems for their automation, the following picture might look familiar. A fragmented automation landscape where each team chose its tooling to meet their own productivity goals. 

<!--truncate-->

![overview](fragmentation.png#gh-light-mode-only)
![overview](fragmentation-dark.png#gh-dark-mode-only)


If we zoom in with our Security/Operations hat on and highlight Software Supply Chain Security aspects such as artifact storage, attestation crafting and signing/verification, we end up with a more complex view.

![overview](fragmentation-ssc.png#gh-light-mode-only)
![overview](fragmentation-ssc-dark.png#gh-dark-mode-only)


Different **teams implementing different ways** of storing their generated artifacts, SBOMs or logs. Some might put them on a 3rd party artifacts storage, others in an ephemeral one or not even store them at all! Some teams might be generating signed workflow attestations, but their **format, storage location, signing method and key management are not standardized either**.  

This is a specially problematic scenario for SecOps teams now that it's clear that **higher security standards [must](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf) be [met](https://www.federalregister.gov/documents/2021/05/17/2021-10460/improving-the-nations-cybersecurity)**. So a set of standards around tooling, practices and processes **must be adopted by the organization as a whole.** 

But that's easier said than done.

A problem we've seen over the years is how [poorly defined, and clashing, development and SecOps team dynamics can be](/blog/a-tale-of-supply-chain-attestation) due to priorities mismatch. We've been on both sides of the aisle and we know how hard it is to standardize best practices and security requirements in an organization, especially in the current fragmented landscape. We also know from the developer's point of view how time-consuming and frustrating is to pollute your CI/CD systems with convoluted, error-prone and complex processes to comply with the SecOps team.

So there has to be a better way that satisfies both sides...

### Enter ChainLoop

You can think of it as an **API for your organization's Software Supply Chain** that both parties can use to interact effectively to meet their often mismatched set of goals and priorities. 

![overview](/img/v2/chainloop-dev-overview.png#gh-light-mode-only)
![overview](/img/v2/chainloop-dev-overview-dark.png#gh-dark-mode-only)

SecOps teams re-gain visibility, standardization and control by [having a mechanism](/getting-started/workflow-definition#workflow-contracts) to **define and propagate attestation requirements**, while developers get jargon-free tooling that can be used to meet compliance with minimum friction.

### How does it work?

Enough marketing speak! How does it work? 

Glad you asked! The gist of it is that ChainLoop is a Software as a Service (SaaS) that consists of **a SLSA level 3 provenance-compliant control-plane/single source of truth for artifacts and attestation** as well as a dead-simple, **contract-based attestation crafting process**. All of that built on Open Source standards such as [Sigstore](https://www.sigstore.dev/), [in-toto](https://in-toto.io/), [SLSA](https://slsa.dev) and [OCI](https://github.com/opencontainers/image-spec/blob/main/spec.md). 

But to get an in-depth understanding of the system we recommend taking a look at [this overview](/how-does-it-work) or jumping directly at our [getting started guide](/category/getting-started).

### Give it a try

You might not be sure if [ChainLoop is for you](https://docs.chainloop.dev/who-is-it-for), but if you know already, I have good news, ChainLoop is on [early access](/category/getting-started) so why don't you give it a try and send feedback our way :)

We are very excited about the possibilities that having this foundation can enable on your Software Supply Chain, from improving communication between teams to the implementation of Service Level Agreements (SLOs), policy enforcement or visibility in general. 

For more on that [stay tuned](https://us21.list-manage.com/contact-form?u=801f42b3abafc40b1a17c5f25&form_id=3f3bbfe15e6fcd4a60be9b966652cfd5)!
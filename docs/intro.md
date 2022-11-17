---
sidebar_position: 1
slug: /
toc_max_heading_level: 4
---

# Introduction

:::tip
[Read this post](/blog/a-tale-of-supply-chain-attestation) for an introduction of the problem we are solving

:::

One of the key areas of Software Supply Chain Security is to make sure your automation is generating **authenticated, tamper-resistant, artifact, and attestation meta-data** that can be used later on for auditing and policy enforcement. 

To achieve that goal, there are great building blocks for attestation crafting (e.g [in-toto](https://in-toto.io/)), signing/verification ([Sigstore](https://www.sigstore.dev/)), and storing ([CAS/OCI](https://github.com/opencontainers/image-spec/blob/main/spec.md)) but putting these together cohesively, securely in an end-to-end solution that's easy to use is not trivial. 

And that’s just part of the problem, then a) development teams need to be trained and convinced to craft, sign and store the attestations as part of their CI/CD workflows. b) SecOps team needs to define processes and tooling to make sure standardization and best practices are respected moving forward and new attestation requirements can be propagated and communicated effectively to their organizations.

## Enter ChainLoop: The Control Plane for your Software Supply Chain

![overview](/img/v2/chainloop-dev-overview.png#gh-light-mode-only)
![overview](/img/v2/chainloop-dev-overview-dark.png#gh-dark-mode-only)

ChainLoop is a Software as a Service (SaaS) that consists of a [SLSA level 3](https://slsa.dev/spec/v0.1/requirements#summary-table) provenance-compliant **control-plane/single source of truth** for artifacts and attestation as well as a dead-simple, [contract-based](/getting-started/workflow-definition#workflow-contracts) attestation crafting process.

It provides your Security/Operation teams with

- SLSA level 3 compliant single Source of truth for artifacts and attestation built on OSS standards such as Sigstore, in-toto, SLSA and OCI.
- Full control on what kind of data (build info, materials) must be part of the attestation via [**Workflow Contracts**](/getting-started/workflow-definition#workflow-contracts) that can be propagated and enforced downstream to your organization.
- Org-wide workflow, attestation, and artifacts [visibility and standardization](/getting-started/operator-view).

Dev/Apps teams on the other hand 

- Will get compliance with minimum effort since ChainLoop plugs into their existing CI/CD pipelines.
- They will not need to become security experts. The [crafting tool](/getting-started/attestation-crafting) will guide them with guardrails and a familiar DevExp to make sure they comply with the Workflow Contract defined by the SecOps team.

Although ChainLoop runs as a service, it is **designed to be a multi-tenant control plane, not a data plane**. The uploaded artifacts and attestations are stored in an [OCI registry of your choice](/getting-started/setup#add-oci-repository). 
## Who is it for?

ChainLoop might be a good fit if

with your SecOps hat on, you

* have been tasked with enabling [SLSA](https://slsa.dev) compliance in the Software Supply Chain of your organization.
* are trying to wrap your head around attestation in the context of [NIST 800-218](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf) and [Executive Order 14028](https://www.federalregister.gov/documents/2021/05/17/2021-10460/improving-the-nations-cybersecurity) and want to get one step closer to compliance.
* want to implement a standardization framework in your organization's fragmented Software Supply Chain security. Or you have tried and failed in the process.
* have no visibility on your SSC, their practices or their readiness level.
* want to implement SSC readiness service level objectives (SLOs) or release gateways.
* are frustrated with the development team's lack of commitment and priorities mismatch.

with your developer hat on, you

* have too much on your plate already and just want to get over with the security requirements with minimum amount of work and via a simple, jargon-free process.
* don't want or have time to implement yet another log or artifact storage.
* are frustrated with continuous new requirements from the SecOps team and would prefer to have a clear framework to get them out of your way so you can focus on your actual priority, to ship your product.

## How does it work?

The process of connecting an existing workflow to ChainLoop and crafting an attestation looks like this

![flow](/img/v2/chainloop.dev.png#gh-light-mode-only)
![flow](/img/v2/chainloop.dev-dark.png#gh-dark-mode-only)

### Operator - Setup

1. An operator [creates a Workflow, a Contract (schema), and a service account](/getting-started/workflow-definition#workflow-and-contract-creation)


### Developer - Attestation Crafting

2. Set up the provided service account in their CI

3. [Start the crafting process](/getting-started/attestation-crafting#initialization) by authenticating with the service account and **retrieving the contract**.

4. [Add the **materials required by the contract**](/getting-started/attestation-crafting#adding-materials), i.e artifact, OCI image ref, SBOM. If needed, the artifact will be uploaded to the built-in CAS and referenced by its content digest

5. [Generate and push](/getting-started/attestation-crafting#encode-sign-and-push-attestation) a signed in-toto statement once all the required materials have been added.

### Operator - Inspect data

6. [Verify Attestation/Artifact metadata](/getting-started/operator-view). They also have access to operational metrics

7. [Download Artifacts](/getting-started/operator-view#artifacts-download).

8. [Subscribe to exported Metrics](/getting-started/operator-view#metrics-coming-soon)

At this point, the SecOps team has control of the attestation and artifacts expectations (via Workflow contracts), which can be updated at any time with new requirements.

They also gained visibility, and have all the metadata and artifacts meeting the latest standards and best practices, while developers have been shielded from most of the complexity related to this process.
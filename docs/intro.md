---
sidebar_position: 1
slug: /
toc_max_heading_level: 4
---

# Introduction

Your name is Dyson, **you work on the Security and Operations (SecOps) team** at Cyberdyne solutions. You are in charge of making sure that the organization's Software Supply Chain Security is improved end-to-end, from source code to packaging and distribution.

You feel pretty good about the current state of things. Your development teams are already signing their commits, scanning their first and third-party components, generating Software Build of Materials (SBOMs), signing container images and even blocking releases based on vulnerability scanning or signature verification. Life is good!

The next day you receive an email from your CISO saying that all the progress in application security is great but an additional effort needs to be done to make sure we can trust all that metadata.

He seems to be **concerned** about all that **information** being **scattered around, not being trustworthy or easily available for auditing**. He sends a link to [slsa.dev](https://slsa.dev/) and says we need to be at least level 3 at that, whatever that means.

Got it! It seems that what we need to do is to **implement an attestation and provenance layer in our SSC**, we "just" need to

* figure out the format of this new piece of metadata (attestation/provenance) that can glue artifacts together.
* put together a place where the provenance information and their associated artifacts (SBOMs, static analysis, vulnerability scanner output) can be stored.
* ensure authenticity and integrity via some sort of signing process.

Choosing solutions for each of those areas was surprisingly straightforward since there are great building blocks for attestation crafting (e.g [in-toto](https://in-toto.io/)), signing/verification ([Sigstore](https://www.sigstore.dev/)), and storing ([CAS/OCI](https://github.com/opencontainers/image-spec/blob/main/spec.md)), but figuring out an end-to-end wasn't easy. 

In any case, your team spends the next couple of months deploying an OCI artifact storage, defining the expected attestation specification, building some tooling to glue it all together, and writing a lot of documentation to share with the development teams for their integration.

Now to the easy part (or what you think), to make developer teams adopt it.

## Day one integration

Let's introduce team Skynet, they are building (in their words) a revolutionary AI.

They leverage a pretty standard CI/CD setup using GitHub Actions. Build/Test a couple of GoLang/Java services, package them into signed container images, craft and store SBOMs in S3 and then deploy them to Kubernetes.

You open a chat with Sarah, one of their lead developers and it goes like this (pleasantries skipped):

D - Hi Sarah, I have some security requirements that I'll need you to put in place in your CI/CD as soon as possible.

S - Hi Dyson, but we already did a ton of work on that!

D - Yes I know, but this is different. What you did was implement application security. What we need now is for us to understand more about the CI/CD setup and collect all the additional information that you are already creating, the SBOM remember? 

S - Oh, I see. how much work is that? We are quite constrained already, we have to launch soon.

D - I'll send you a document with all the details, but long story short we need you to craft an attestation using in-toto that will contain a SLSA provenance statement, sign it with cosign and store it in an OCI registry that our team has put in place. Ahh, and you'll need to start pushing your existing artifacts to that OCI registry too.

D - Could you carve out some time in your future sprints to start looking into that?

S - Wait but we have already a lot on our plate, and to be frank I understood half of the words you just said.

D - Sigh... but all this work is required to meet new compliance requirements so I am afraid that delaying it's not an option.

S - I'll see what I can do

After weeks of back and forth, the Skynet team integration is done and the SecOps teams now have access to the workflow build information via signed attestations and their associated artifacts (sBOM, logs, ...) in a centralized OCI registry. You will tell our boss that the **Skynet team reached SLSA level 3 provenance compliance**! Life is good, again.

## Day two challenges

You quickly realized that applying this process to all teams doesn't scale. It's time-consuming, requires manual work and frustrates both sides.

But the **worst part is yet to come. Day two operations**.

### Enforcing new requirements

After some trial and error querying the information you realize all CI pipelines that build container images will also need to send the Dockerfile and their base image. In addition, signing/verification capabilities need to be elevated by leveraging our brand-new transparent log and ephemeral key management [1].

Implementing such iterative changes requires a similar manual, **overloaded communication and interaction pattern** as seen before, over and over again.

### Enforcing best practices

You realize that it's hard to make sure all the teams are following the documented best practices. For example, some teams might not be storing their container images content digest in their attestation or storing the artifacts in the provided artifact storage.

Now you have to inspect each attestation to make sure they are compliant with your requirements.

### Prevent configuration drift or regressions

You also notice it's very hard to keep track of the state of the attestation integration each team is in. Some might have fallen behind the latest requirements. In fact, It's very hard to detect if a regression has been added or an integration has been removed altogether.

### Lack of visibility and actionability

Although you are receiving attestation and artifacts from different teams, you still lack information about your Organization's Software Supply Chain as a whole, their owners, their readiness, implementation state and so on.

Even worse, if you detect an issue during auditing or because of a new security issue, there aren’t any enforcement mechanisms for even blocking a CI workflow if needed.

## Enter ChainLoop

ChainLoop is built on the promise of providing a similar state-of-the-art attestation/provenance compliance but through a mechanism that has **lower friction, removes manual steps and makes day-two operations first-class citizens**.

A Software as a Service (SaaS) that consists of a [SLSA level 3](https://slsa.dev/spec/v0.1/requirements#summary-table) provenance-compliant **control-plane/single source of truth** for artifacts and attestation as well as a dead-simple, [contract-based](/getting-started/workflow-definition#workflow-contracts) attestation crafting process.

![overview](/img/v2/chainloop-dev-overview.png#gh-light-mode-only)
![overview](/img/v2/chainloop-dev-overview-dark.png#gh-dark-mode-only)

It provides your Security/Operation teams with

- SLSA level 3 compliant single Source of truth for artifacts and attestation built on OSS standards such as Sigstore, in-toto, SLSA and OCI.
- Full control on what kind of data (build info, materials) must be part of the attestation via [**Workflow Contracts**](/getting-started/workflow-definition#workflow-contracts) that can be propagated and enforced downstream to your organization.
- Org-wide workflow, attestation, and artifacts [visibility and standardization](/getting-started/operator-view).

Dev/Apps teams on the other hand 

- Will get compliance with minimum effort since ChainLoop plugs into their existing CI/CD pipelines.
- They will not need to become security experts. The [crafting tool](/getting-started/attestation-crafting) will guide them with guardrails and a familiar DevExp to make sure they comply with the Workflow Contract defined by the SecOps team.

Although ChainLoop runs as a service, it is **designed to be a multi-tenant control plane, not a data plane**. The uploaded artifacts and attestations are stored in an [OCI registry of your choice](/getting-started/setup#add-oci-repository). 

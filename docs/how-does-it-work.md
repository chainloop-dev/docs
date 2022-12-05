---
sidebar_position: 2
---

import MailingListForm from './partials/\_mailing-list-form.mdx';

# How Does it Work?

ChainLoop is a Software as a Service (Open Source soon), that consists of a [SLSA level 3](https://slsa.dev/spec/v0.1/requirements#summary-table) provenance-compliant **control plane and single source of truth** for artifacts and attestation **plus a dead-simple, [contract-based](/getting-started/workflow-definition#workflow-contracts) attestation crafting process**.

![overview](/img/v2/chainloop-parts.png#gh-light-mode-only)
![overview](/img/v2/chainloop-parts-dark.png#gh-dark-mode-only)

It provides your Security/Operation teams with a **centralized control plane** to achieve

**Standardization**

SLSA level 3 compliant single Source of truth for artifacts and attestation built on OSS standards such as [Sigstore](https://www.sigstore.dev/), [in-toto](https://in-toto.io/), [SLSA](https://slsa.dev) and [OCI](https://github.com/opencontainers/image-spec/blob/main/spec.md).

**Control**

Full control on what kind of data (build info, materials) must be part of the attestation via [**Workflow Contracts**](/getting-started/workflow-definition#workflow-contracts) that can be propagated and enforced downstream to your organization.

**Observability/Auditability**

Org-wide workflow, attestation, and artifacts [visibility and standardization](/getting-started/operator-view), including error rates, and operational anomalies.

Development/Application teams on the other hand

- Will get compliance with minimum effort since ChainLoop plugs into their existing CI/CD pipelines.
- They will not need to become security experts. The [crafting tool](/getting-started/attestation-crafting) will guide them with guardrails and a familiar DevExp to make sure they comply with the Workflow Contract defined by the SecOps team.

## Integration Overview

![overview](/img/v2/chainloop-dev-overview.png#gh-light-mode-only)
![overview](/img/v2/chainloop-dev-overview-dark.png#gh-dark-mode-only)

In short, the integration process of a new pipeline in ChainLoop consists of

- The Operator registers a contract for that pipeline in the control plane.
- The developers that own the pipeline use ChainLoop's CLI to craft an attestation to comply with the contract.

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

<MailingListForm />

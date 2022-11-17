---
sidebar_position: 3
---

# How Does it Work? 

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
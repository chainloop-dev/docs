A Workflow Contract **defines the expectations of what content a workflow must send as part of their attestation**. For example, a schema could explicitly state that the URI@digest of the generated container image, the container rootfs used during build, and the commit sha must be present in the attestation.

There are two additional properties of Workflow Contracts that aims to ease the management of workflows in your organization

* A Workflow Contract is **immutable and versioned**, new revisions of the contract with new/different requirements can be added over time. This is especially useful for iterative integrations.
* **A Workflow Contract can belong to more than one Workflow**. This means that a change in a single contract will be propagated to many workflows. This is especially useful for org-wide standardization and fleet management.

:::tip
A Workflow Contract can be provided in `json`, `yaml` or [`cue`](https://cuelang.org) formats.
:::
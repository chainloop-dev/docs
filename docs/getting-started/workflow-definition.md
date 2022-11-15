---
sidebar_position: 4
title: Workflow Creation
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Introduction

Next, let's introduce two of the most important entities in ChainLoop's control plane, **workflows** and **workflow contracts**.

### Workflows

A workflow represents the identity of any automation, any CI/CD workflow you want to register in the Control Plane, so you can receive their attestation and artifacts. **A Workflow is associated with a Workflow Contract**, explained next.

### Workflow Contracts

A workflow contract defines a schema with the expectation in terms of the content a registered workflow must send to the control plane as part of their attestation. For example, a schema could explicitly state that the URI@digest of the generated container image, the container rootfs used during build, and the commit sha must be present in the attestation.

There are two additional properties of Workflow Contracts that aims to ease the management of workflows in your organization

* A Workflow Contract is immutable and versioned, new revisions of the contract with new/different requirements can be added over time. This is especially useful for iterative integrations.
* A Workflow Contract can belong to more than one workflow. This means that a change in a single contract will be propagated to many workflows. This is especially useful for org-wide standardization and fleet management.
* A Workflow Contract can be provided in `json`, `yaml` or [`cue`](https://cuelang.org) formats.

### Robot Accounts

A robot account is a long-lasting, though revokable, **secret token associated with a Workflow**. It's meant to be used in the target CI/CD pipeline during the attestation process. This token along with the crafting CLI are the only two things development/Apps teams need for the integration.

### Example

In the following example, we can see three CI/CD pipelines associated with their respective ChainLoop workflows. Two of those Workflows are sharing the same Contract (using the same or different revision).

![flow](/img/v2/workflow-overview.png#gh-light-mode-only)
![flow](/img/v2/workflow-overview-dark.png#gh-dark-mode-only)

## Workflow and Contract creation

Let's say that we have a CI pipeline that we want to **integrate with ChainLoop** so we can get **visibility** on as well as make it **SLSA compliant via signed attestation/artifacts**.

To achieve that, we will need to

* Create a new Workflow Contract (optional)
* Create a Workflow associated with a new or existing Contract
* Create a Robot account for that Workflow so the integration can happen in the CI.

### Workflow Create

Let's create a Workflow for our `build and test` CI pipeline
```bash
$ chainloop workflow create \
    --name "build-and-test" \
    --project "skynet" \
    --team "cyberdyne core"
┌──────────────────────────────────────┬────────────────┬─────────┬────────────────┬─────────────────────┬────────┬─────────────────┐
│ ID                                   │ NAME           │ PROJECT │ TEAM           │ CREATED AT          │ # RUNS │ LAST RUN STATUS │
├──────────────────────────────────────┼────────────────┼─────────┼────────────────┼─────────────────────┼────────┼─────────────────┤
│ 2d289d33-8241-47b7-9ea2-8bd8b7c126f8 │ build-and-test │ skynet  │ cyberdyne core │ 01 Nov 22 23:09 UTC │      0 │                 │
└──────────────────────────────────────┴────────────────┴─────────┴────────────────┴─────────────────────┴────────┴─────────────────┘
```

By default, if no contract is provided, a new, empty one will be created

```bash
$ chainloop workflow contract ls                                              
┌──────────────────────────────────────┬─────────────────────────────────┬─────────────────┬─────────────────────┬─────────────┐
│ ID                                   │ NAME                            │ LATEST REVISION │ CREATED AT          │ # WORKFLOWS │
├──────────────────────────────────────┼─────────────────────────────────┼─────────────────┼─────────────────────┼─────────────┤
│ fd489047-67f1-45d4-9f3b-27eba4051929 │ build-and-test generated schema │               1 │ 01 Nov 22 23:09 UTC │           1 │
└──────────────────────────────────────┴─────────────────────────────────┴─────────────────┴─────────────────────┴─────────────┘

$ chainloop workflow contract describe --id fd489047-67f1-45d4-9f3b-27eba4051929
┌─────────────────────────────────────────────────────────────┐
│ Contract                                                    │
├──────────────────────┬──────────────────────────────────────┤
│ Name                 │ build-and-test generated schema      │
├──────────────────────┼──────────────────────────────────────┤
│ ID                   │ fd489047-67f1-45d4-9f3b-27eba4051929 │
├──────────────────────┼──────────────────────────────────────┤
│ Associated Workflows │ 2d289d33-8241-47b7-9ea2-8bd8b7c126f8 │
├──────────────────────┼──────────────────────────────────────┤
│ Revision number      │ 1                                    │
├──────────────────────┼──────────────────────────────────────┤
│ Revision Created At  │ 01 Nov 22 23:09 UTC                  │
└──────────────────────┴──────────────────────────────────────┘
┌─────────────────────────┐
│ {                       │
│   "schemaVersion": "v1" │
│ }                       │
└─────────────────────────┘
```

### Add materials to the Contract

We are going to update the contract with the materials we expect the attestation for this specific workflow to contain

* built container image as output
* rootfs directory used during build
* dockerfile (optional)
* commit sha
* A custom env variable to be resolved
* Github Action as [target runner context](/reference/operator/contract#runner-context). This means that this contract is valid only for that platform.

:::note
   Setting the runner context type is optional, see [runner contexts](/reference/operator/contract#runner-context) for more information.
:::

<Tabs>
<TabItem value="yaml" label="yaml" default>

```yaml title=skynet.contract.yaml showLineNumbers
# Workflow Contract updated
schemaVersion: v1
# Three required and one optional materials of three different kinds
materials:
   # CONTAINER_IMAGE kinds will get resolved to retrieve their repository digest
   - type: CONTAINER_IMAGE
     name: skynet-control-plane
      # The output flag indicates that the material will be part of the attestation subject
     output: true 
   # ARTIFACT kinds will first get uploaded to the built-in Content Addressable Storage (CAS)
   - type: ARTIFACT
     name: rootfs
   - type: ARTIFACT
     name: dockerfile
     optional: true
   # STRING kind materials will be injected as simple keypairs
   - type: STRING
     name: commit
# Env vars we want the system to resolve and inject during attestation initialization
# Additional ones can be inherited from the specified runner context below
envAllowList:
   - CUSTOM_VAR
# Enforce in what runner context the attestation must happen
# If not specified, the attestation crafting process is allowed to run anywhere
runner: 
   type: "GITHUB_ACTION"
```

</TabItem>
<TabItem value="cue" label="cue">

```cue title=skynet.contract.cue showLineNumbers
// Workflow Contract updated
{
   schemaVersion: "v1",
   // Three required and one optional materials of three different kinds
   // The output flag indicates that the material will be part of the attestation subject
   materials: [
      // CONTAINER_IMAGE kinds will get resolved to retrieve their repository digest
      { type: "CONTAINER_IMAGE", name: "skynet-control-plane", output: true },
      // ARTIFACT kinds will first get uploaded to the built-in Content Addressable Storage (CAS)
      { type: "ARTIFACT", name: "rootfs" },
      { type: "ARTIFACT", name: "dockerfile", optional: true },
      // STRING kind materials will be injected as simple keypairs
      { type: "STRING", name: "commit" }
   ],
   // Env vars we want the system to resolve and inject during attestation initialization
   // Additional ones can be inherited from the specified runner context below
   envAllowList: [ "CUSTOM_VAR" ]
   // Enforce in what runner context the attestation must happen
   // If not specified, the attestation crafting process is allowed to run anywhere
   runner: type: "GITHUB_ACTION"
}
```
</TabItem>
<TabItem value="json" label="json">

```json title=skynet.contract.json showLineNumbers
{
   "schemaVersion": "v1",
   "materials": [
      { "type": "CONTAINER_IMAGE", "name": "skynet-control-plane", "output": true },
      { "type": "ARTIFACT", "name": "rootfs" },
      { "type": "ARTIFACT", "name": "dockerfile", "optional": true },
      { "type": "STRING", "name": "commit" }
   ],
   "envAllowList": [ "CUSTOM_VAR" ],
   "runner": { "type": "GITHUB_ACTION" }
}
```
</TabItem>
</Tabs>

Update the name and schema, notice the revision increment

```bash
$ chainloop workflow contract update \
   --id fd489047-67f1-45d4-9f3b-27eba4051929 \
   --name skynet-contract \
   -f skynet.contract.json

┌─────────────────────────────────────────────────────────────┐
│ Contract                                                    │
├──────────────────────┬──────────────────────────────────────┤
│ Name                 │ skynet-contract                      │
├──────────────────────┼──────────────────────────────────────┤
│ ID                   │ fd489047-67f1-45d4-9f3b-27eba4051929 │
├──────────────────────┼──────────────────────────────────────┤
│ Associated Workflows │ 2d289d33-8241-47b7-9ea2-8bd8b7c126f8 │
├──────────────────────┼──────────────────────────────────────┤
│ Revision number      │ 2                                    │
├──────────────────────┼──────────────────────────────────────┤
│ Revision Created At  │ 02 Nov 22 09:08 UTC                  │
└──────────────────────┴──────────────────────────────────────┘
┌───────────────────────────────────────┐
│ {                                     │
│   "schemaVersion": "v1",              │
│   "materials": [                      │
│     {                                 │
│       "type": "CONTAINER_IMAGE",      │
│       "name": "skynet-control-plane", │
│       "output": true                  │
...
```

:::note
We could have reached the same result by first creating the contract via `chainloop workflow contract create -f ...` and then attaching it during workflow creation `chainloop workflow create ... --contract deadbeef`
:::

### Robot Account creation

The final step is to create a robot account that will be shared with the development team so they can start the integration. 

:::note
* Robot accounts are attached to a single workflow. If you create another workflow, another robot account must be created.
* You can have more than one robot account associated with a workflow.
* Accounts can be revoked via `chainloop workflow robot-account revoke` command
:::

```bash
$ chainloop workflow robot-account create \
    --workflow 2d289d33-8241-47b7-9ea2-8bd8b7c126f8 \
    --name prod-ci

┌──────────────────────────────────────┬─────────┬──────────────────────────────────────┬─────────────────────┬────────────┐
│ ID                                   │ NAME    │ WORKFLOW ID                          │ CREATED AT          │ REVOKED AT │
├──────────────────────────────────────┼─────────┼──────────────────────────────────────┼─────────────────────┼────────────┤
│ 4f2376fa-48c8-4e46-a921-977ec44486a9 │ prod-ci │ 2d289d33-8241-47b7-9ea2-8bd8b7c126f8 │ 01 Nov 22 23:43 UTC │            │
└──────────────────────────────────────┴─────────┴──────────────────────────────────────┴─────────────────────┴────────────┘

Save the following token since it will not printed again: 

 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.REDACTED.lXdvZusJgHyeHDl39RGPNxxrmTUZBN0_QAbJU5ZVxR8
```

We have everything we need to integrate our CI with ChainLoop!
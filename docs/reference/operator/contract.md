---
sidebar_position: 1
title: Workflow Contract
---

## Runner Context

An optional runner type can be provided in a workflow contract.


```yaml title=skynet.contract.yaml showLineNumbers
schemaVersion: v1
materials:
   - type: CONTAINER_IMAGE
     name: skynet-control-plane
envAllowList:
   - CUSTOM_VAR
# highlight-start
runner: 
   type: "GITHUB_ACTION"
# highlight-end
```

It has the following effect in the attestation process.

* Running the attestation in the target runner type is required unless `--dry-run` flag is set during initialization.
* A link to the workload (i.e Github Action Run link) will be recorded both in the attestation and in the control plane during initialization.
* An additional set of environment variables will be resolved in addition to the ones defined in the contract [`envAllowList`](/getting-started/workflow-definition#add-materials-to-the-contract).

Currently we support the following runner types

:::info
New templates for other runner types will be added over time. If yours is not implemented yet, please [contact us](https://us21.list-manage.com/contact-form?u=801f42b3abafc40b1a17c5f25&form_id=3f3bbfe15e6fcd4a60be9b966652cfd5)
:::

### `GITHUB_ACTION`

The following environment variables will be automatically added to the attestation. For more information on what they do refer to [this link](https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables).

* `GITHUB_ACTOR`
* `GITHUB_REF`
* `GITHUB_REPOSITORY`
* `GITHUB_REPOSITORY_OWNER`
* `GITHUB_RUN_ID`
* `GITHUB_SHA`
* `RUNNER_NAME`
* `RUNNER_OS`

A link to the Github Action will be recorded in the control plane too during initialization.

:::note
Remember, if not all the **env variables** that you need are present, complete this list with `envAllowList` option in the contract.
:::

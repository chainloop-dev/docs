---
sidebar_position: 1
title: Workflow Contract
---
## Runner Context


:::info
New runner contexts will be added over time. If yours is not implemented yet, please [contact us](https://us21.list-manage.com/contact-form?u=801f42b3abafc40b1a17c5f25&form_id=3f3bbfe15e6fcd4a60be9b966652cfd5)
:::

An **optional** runner type can be provided in a workflow contract.

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

* **Require** the attestation process to be executed in the target runner type unless the `--dry-run` flag is set during initialization.
* **A link to the workload** (i.e Github Action Run link) **will be recorded** both in the attestation and in the control plane during initialization.
* An additional set of environment variables will be resolved in addition to the ones defined in the contract [`envAllowList`](/getting-started/workflow-definition#add-materials-to-the-contract).

Currently we support the following runner types

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

### `GITLAB_PIPELINE`

The following environment variables will be automatically added to the attestation. More information about what they mean in [Gitlab's official documentation](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html)

* `GITLAB_USER_EMAIL`
* `GITLAB_USER_LOGIN`
* `CI_PROJECT_URL`
* `CI_COMMIT_SHA`
* `CI_JOB_URL`
* `CI_PIPELINE_URL`
* `CI_RUNNER_VERSION`
* `CI_RUNNER_DESCRIPTION`
* `CI_COMMIT_REF_NAME`

A link to the Gitlab CI job will be recorded in the control plane too during initialization.

:::tip
Remember, if all the **env variables** that you need are not defined in the context, you can extend such list via the `envAllowList` option.
:::

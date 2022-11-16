---
sidebar_position: 1
slug: /
toc_max_heading_level: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Introduction

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

### Initial setup

1. An operator [creates a Workflow, a Contract (schema), and a service account](/getting-started/workflow-definition)

<Tabs>
<TabItem value="yaml" label="yaml" default>

```yaml title=chainloop-contract-example.yaml showLineNumbers
# Workflow Contract Example
schemaVersion: v1
# Three required materials of three different kinds
# The output flag indicates that the material will be part of the attestation subject
materials:
   # STRING kind materials will be injected as simple keypairs
   - type: STRING
     name: commit
   # ARTIFACT kinds will first get uploaded to the built-in Content Addressable Storage (CAS)
   - type: ARTIFACT
     name: control-plane-linux-amd64
     output: true
   # CONTAINER_IMAGE kinds will get resolved to retrieve their repository digest
   - type: CONTAINER_IMAGE
     name: control-plane-image
     output: true
# Env vars we want the system to resolve and inject during attestation initialization
envAllowList:
   - CUSTOM_VAR
# Enforce the runner context the attestation must happen
# If not specified, the attestation crafting process is allowed to run anywhere
runner: 
   type: "GITHUB_ACTION"
```

</TabItem>
<TabItem value="cue" label="cue">

```cue title=chainloop-contract-example.cue showLineNumbers
// Workflow Contract Example
schemaVersion: "v1",
// Three required materials of three different kinds
// The output flag indicates that the material will be part of the attestation subject
materials: [
   // String kind materials will be injected as simple keypairs
   { type: "STRING", name: "commit" },
   // Artifact kinds will first get uploaded to the built-in Content Addressable Storage (CAS)
   { type: "ARTIFACT", name: "control-plane-linux-amd64", output: true },
   // Container image kinds will get resolved to retrieve their repository digest
   { type: "CONTAINER_IMAGE", name: "control-plane-image", output: true }
],
// Env vars we want the system to resolve and inject during attestation initialization
envAllowList: [ "CUSTOM_VAR" ]
// Enforce the runner context the attestation must happen
// If not specified, the attestation crafting process is allowed to run anywhere
runner: type: "GITHUB_ACTION"
```

</TabItem>
<TabItem value="json" label="json">

```json title=chainloop-contract-example.json showLineNumbers
{
   "schemaVersion": "v1",
   "materials": [
      { "type": "STRING", "name": "commit" },
      { "type": "ARTIFACT", "name": "control-plane-linux-amd64", "output": true },
      { "type": "CONTAINER_IMAGE", "name": "control-plane-image", "output": true }
   ],
   "envAllowList": [ "CUSTOM_VAR" ],
   "runner": { "type": "GITHUB_ACTION" }
}
```
</TabItem>
</Tabs>

2. The dev team sets up the provided service account in their CI

### Attestation Crafting

During a workflow run, creating a new attestation consists of

#### attestation init

3. Initializing the crafting process by authenticating with the service account and **retrieving the contract**.

```bash
$ chainloop attestation init --contract-revision 1
INF Retrieving workflow information from the control plane
INF Attestation initialized! now you can check its status or add materials to it
┌───────────────────┬──────────────────────────────────────┐
│ Initialized At    │ 28 Oct 22 21:02 UTC                  │
├───────────────────┼──────────────────────────────────────┤
│ Workflow          │ 20e8514d-a52e-4468-a46c-f4032a72b389 │
│ Name              │ release                              │
│ Team              │ core                                 │
│ Project           │ bedrock                              │
│ Contract Revision │ 1                                    │
└───────────────────┴──────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────────────┐
│ Materials                                                                │
├───────────────────────────┬─────────────────┬─────┬──────────┬───────────┤
│ NAME                      │ TYPE            │ SET │ REQUIRED │ IS OUTPUT │
├───────────────────────────┼─────────────────┼─────┼──────────┼───────────┤
│ commit                    │ STRING          │ No  │ Yes      │           │
│ control-plane-linux-amd64 │ ARTIFACT        │ No  │ Yes      │ x         │
│ control-plane-image       │ CONTAINER_IMAGE │ No  │ Yes      │ x         │
└───────────────────────────┴─────────────────┴─────┴──────────┴───────────┘
┌───────────────────────────────────────────┐
│ Env Variables                             │
├───────────────────┬───────────────────────┤
│ CUSTOM_VAR        │ RESOLVED_VALUE        │
└───────────────────┴───────────────────────┘
```
 
#### attestation add

4. Add the **materials required by the contract**, i.e artifact, OCI image ref, SBOM. If needed, the artifact will be uploaded to the built-in CAS and referenced by its content digest

```bash
# Add container image
$ chainloop attestation add --name control-plane-image --value ***.dkr.ecr.us-east-1.amazonaws.com/chainloop-control-plane:v0.7.6
INF material added to attestation

# Attach artifact
$ chainloop attestation add --name control-plane-linux-amd64 --value ./releases/bin/x86_64/control-plane
14.24% [##................] [5.24MB in 2.611108s; ~ETA: 16s; 2.01MB/s] ... control-plane@sha256:5f8371df50a378e63a7f8a56280d3b99f0a1ca511be8ffa64b5cca327416431e
99.67% [#################.] [36.70MB in 20.860795s; 1.76MB/s] ... control-plane@sha256:5f8371df50a378e63a7f8a56280d3b99f0a1ca511be8ffa64b5cca327416431e
control-plane@sha256:5f8371df50a378e63a7f8a56280d3b99f0a1ca511be8ffa64b5cca327416431e ... done! [36.82MB in 20.934s; 1.74MB/s]
INF material added to attestation

# COMMIT INFO
$ chainloop attestation add --name commit --value deadbeef
```

#### attestation push

5. Once all the required materials have been attached, a **signed in-toto statement will be generated and sent for storage**

```bash
# See the recorded values
$ chainloop attestation status --full
───────────────────┬──────────────────────────────────────┐
│ Initialized At    │ 28 Oct 22 21:02 UTC                  │
├───────────────────┼──────────────────────────────────────┤
│ Workflow          │ 20e8514d-a52e-4468-a46c-f4032a72b389 │
│ Name              │ release                              │
│ Team              │ core                                 │
│ Project           │ bedrock                              │
│ Contract Revision │ 1                                    │
└───────────────────┴──────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Materials                                                                                                                                                                                                               │
├───────────────────────────┬─────────────────┬─────┬──────────┬───────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ NAME                      │ TYPE            │ SET │ REQUIRED │ IS OUTPUT │ VALUE                                                                                                                                        │
├───────────────────────────┼─────────────────┼─────┼──────────┼───────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ commit                    │ STRING          │ Yes │ Yes      │           │ 9a96775da456e595f242bb9b5826cf46d8dd5d81                                                                                                     │
│ control-plane-linux-amd64 │ ARTIFACT        │ Yes │ Yes      │ x         │ control-plane@sha256:5f8371df50a378e63a7f8a56280d3b99f0a1ca511be8ffa64b5cca327416431e                                                        │
│ control-plane-image       │ CONTAINER_IMAGE │ Yes │ Yes      │ x         │ ***.dkr.ecr.us-east-1.amazonaws.com/chainloop-control-plane@sha256:963237021c5fd0d31741a9b873e1e8af08c76459cf30e34332925510e0cb3731          │
└───────────────────────────┴─────────────────┴─────┴──────────┴───────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
┌───────────────────────────────────────────┐
│ Env Variables                             │
├───────────────────┬───────────────────────┤
│ CUSTOM_VAR        │ RESOLVED_VALUE        │
└───────────────────┴───────────────────────┘

# render, sign and push the actual attestation
$ chainloop attestation push
{
   "payloadType": "application/vnd.in-toto+json",
   "payload": "eyJfdHlwZSI6Imh0dHBzOi8vaW4tdG90by5pby9TdGF0ZW1lbnQvdjAuMSIsInByZWRpY2F0ZVR5cGUiOiJjaGFpbmxvb3AuZGV2L2F0dGVzdGF0aW9uL3YwLjEiLCJzdWJqZWN0IjpbeyJuYW1lIjoiY2hhaW5sb29wLmRldiLmRrci5lY3IudXMtZWFzdC0xLmFtYXpvbmF3cy5jb20vY2hhaW5sb29wLWNvbnRyb2wtcGxhb...redacted",
   "signatures": [
      {
         "keyid": "",
         "sig": "MEUCIG/OH/v21YTyKMwqj+umW8WpeN1qIOMuN2ZHGsGnZT7hAiEAhe0N9E1zrDN5L9WkXE1RfMBS7wbJC/mqGw/p0eYSIOg="
      }
   ]
}

INF Attestation pushed!
```
6. Operators can verify attestation/artifact data. They also have access to operational metrics

```bash
$ chainloop workflow ls
┌──────────────────────────────────────┬────────────────┬─────────┬──────┬─────────────────────┬────────┬─────────────────┐
│ ID                                   │ NAME           │ PROJECT │ TEAM │ CREATED AT          │ # RUNS │ LAST RUN STATUS │
├──────────────────────────────────────┼────────────────┼─────────┼──────┼─────────────────────┼────────┼─────────────────┤
│ 32f2af08-0839-40f8-9f77-c9f856b87351 │ release        │ docs    │ core │ 03 Nov 22 22:31 UTC │     14 │ success         │
│ 452747b2-9eb5-4893-9e3a-7049a1b1536d │ build-and-test │ docs    │ core │ 03 Nov 22 22:16 UTC │      4 │ success         │
│ ca6d9718-fa49-4a20-9db9-a82080e79632 │ release        │ bedrock │ core │ 03 Nov 22 12:24 UTC │     11 │ success         │
│ f9e6ee94-283c-44dd-8e7d-8fe5816358cb │ build-and-test │ bedrock │ core │ 03 Nov 22 12:24 UTC │    133 │ success         │
└──────────────────────────────────────┴────────────────┴─────────┴──────┴─────────────────────┴────────┴─────────────────┘

# View all the runs for the release workflow
$ chainloop workflow run ls --workflow ca6d9718-fa49-4a20-9db9-a82080e79632 
┌──────────────────────────────────────┬─────────┬──────────┬───────────┬─────────────────────┬──────────────────────────────────────────────────────────────────┐
│ ID                                   │ PROJECT │ WORKFLOW │ STATE     │ CREATED AT          │ RUN URL                                                          │
├──────────────────────────────────────┼─────────┼──────────┼───────────┼─────────────────────┼──────────────────────────────────────────────────────────────────┤
│ a6ec0229-7796-46fc-8df2-a03f4bddab47 │ bedrock │ release  │ success   │ 07 Nov 22 15:03 UTC │ https://github.com/chainloop-dev/bedrock/actions/runs/3411479373 │
│ 3b9e0485-2c48-488e-bca6-9c9ea8f52d90 │ bedrock │ release  │ success   │ 07 Nov 22 11:52 UTC │ https://github.com/chainloop-dev/bedrock/actions/runs/3410079758 │
...

$ chainloop workflow run describe --id a6ec0229-7796-46fc-8df2-a03f4bddab47
┌───────────────────────────────────────────────────────────────────────────────────┐
│ Workflow                                                                          │
├────────────────┬──────────────────────────────────────────────────────────────────┤
│ ID             │ ca6d9718-fa49-4a20-9db9-a82080e79632                             │
│ Name           │ release                                                          │
│ Team           │ core                                                             │
│ Project        │ bedrock                                                          │
├────────────────┼──────────────────────────────────────────────────────────────────┤
│ Workflow Run   │                                                                  │
├────────────────┼──────────────────────────────────────────────────────────────────┤
│ ID             │ a6ec0229-7796-46fc-8df2-a03f4bddab47                             │
│ Initialized At │ 07 Nov 22 15:03 UTC                                              │
│ Finished At    │ 07 Nov 22 15:13 UTC                                              │
│ State          │ success                                                          │
│ Runner Type    │ Github action                                                    │
│ Runner Link    │ https://github.com/chainloop-dev/bedrock/actions/runs/3411479373 │
├────────────────┼──────────────────────────────────────────────────────────────────┤
│ Statement      │                                                                  │
├────────────────┼──────────────────────────────────────────────────────────────────┤
│ Payload Type   │ application/vnd.in-toto+json                                     │
│ Verified       │ false                                                            │
└────────────────┴──────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Materials                                                                                                                                                                                  │
├───────────────────────────┬─────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ NAME                      │ TYPE            │ VALUE                                                                                                                                        │
├───────────────────────────┼─────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ artifact-cas-linux-amd64  │ ARTIFACT        │ artifact-cas@sha256:7778cdd7fdc9984feb4bd9c5615026e194bf4f57bc77cd87eb2d1e67896061fb                                                         │
│ cli-linux-amd64           │ ARTIFACT        │ chainloop@sha256:ba1c06ecad271a314b6d4ae1a3b2f2e77e334c8772f18011be029a947e5d086a                                                            │
│ commit                    │ STRING          │ 6417e226890ae1340cecc9cd9d7692445ee3338e                                                                                                     │
│ control-plane-image       │ CONTAINER_IMAGE │ redacted1111.dkr.ecr.us-east-1.amazonaws.com/chainloop-control-plane@sha256:340ff1f68640cb17980c0422c8f01bddc144cad0c44fab3235b1dc6328126469 │
│ control-plane-linux-amd64 │ ARTIFACT        │ control-plane@sha256:c3cce1b2014e8ec4794dd0995a790f763931eb383b92247e13bad27ad94aba71                                                        │
└───────────────────────────┴─────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────────┐
│ Environment Variables                                              │
├─────────────────────────┬──────────────────────────────────────────┤
│ NAME                    │ VALUE                                    │
├─────────────────────────┼──────────────────────────────────────────┤
│ GITHUB_ACTOR            │ migmartri                                │
│ GITHUB_REF              │ refs/tags/v0.8.10                        │
│ CUSTOM_VAR              │ RESOLVED_VAL                             │
│ GITHUB_REPOSITORY       │ chainloop-dev/bedrock                    │
│ GITHUB_REPOSITORY_OWNER │ chainloop-dev                            │
│ GITHUB_RUN_ID           │ 3411479373                               │
│ GITHUB_SHA              │ 6417e226890ae1340cecc9cd9d7692445ee3338e │
│ RUNNER_NAME             │ GitHub Actions 5                         │
│ RUNNER_OS               │ Linux                                    │
└─────────────────────────┴──────────────────────────────────────────┘

# or output the actual statement
$ chainloop workflow run describe --id a6ec0229-7796-46fc-8df2-a03f4bddab47 --output statement

{                                                                                                    
   "_type": "https://in-toto.io/Statement/v0.1",                                                     
   "predicateType": "chainloop.dev/attestation/v0.1",                                                
   "subject": [                                                                                      
      {                                                                                              
         "name": "chainloop",
         "digest": {                    
            "sha256": "ba1c06ecad271a314b6d4ae1a3b2f2e77e334c8772f18011be029a947e5d086a"
         }                      
      },                                        
      {                                                                                              
         "name": "redacted1111.dkr.ecr.us-east-1.amazonaws.com/chainloop-control-plane",
         "digest": {
            "sha256": "340ff1f68640cb17980c0422c8f01bddc144cad0c44fab3235b1dc6328126469"
         }                                                                                           
      },                                                                                             
   ],                                                                                                
   "predicate": {                                                                                    
      "buildType": "chainloop.dev/workflowrun/v0.1",
      "builder": {
         "id": "chainloop.dev/cli/0.8.8@sha256:5574ad6320409fa57c83261fc7995494abeeb934c576364cd786bf0d9c08c492"                                                                                           
      },            
      "env": {                                                                                       
         "GITHUB_ACTOR": "migmartri",
         "CUSTOM_VAR": "RESOLVED_VALUE",
         "GITHUB_REF": "refs/tags/v0.8.10",
         "GITHUB_REPOSITORY": "chainloop-dev/bedrock",
         "GITHUB_REPOSITORY_OWNER": "chainloop-dev",
         "GITHUB_RUN_ID": "3411479373",                                                              
         "GITHUB_SHA": "6417e226890ae1340cecc9cd9d7692445ee3338e",
         "RUNNER_NAME": "GitHub Actions 5",                                                                                                                                                                
         "RUNNER_OS": "Linux"
      },      
      "materials": [                 
         {
            "material": {
               "slsa": {
                  "digest": {
                     "sha256": "ba1c06ecad271a314b6d4ae1a3b2f2e77e334c8772f18011be029a947e5d086a"
                  },
                  "uri": "chainloop"
               }
            },
            "name": "cli-linux-amd64",
            "type": "ARTIFACT"
         },
         {
            "material": {
               "stringVal": "6417e226890ae1340cecc9cd9d7692445ee3338e"
            },
            "name": "commit",
            "type": "STRING"
         },
         {
            "material": {
               "slsa": {
                  "digest": {
                     "sha256": "340ff1f68640cb17980c0422c8f01bddc144cad0c44fab3235b1dc6328126469"
                  },
                  "uri": "529347126165.dkr.ecr.us-east-1.amazonaws.com/chainloop-control-plane"
               }
            },
            "name": "control-plane-image",
            "type": "CONTAINER_IMAGE"
      ],
      "metadata": {
         "finishedAt": "2022-11-07T15:13:06.001341338Z",
         "initializedAt": "2022-11-07T15:03:58.515631043Z",
         "name": "release",
         "project": "bedrock",
         "team": "core",
         "workflowID": "ca6d9718-fa49-4a20-9db9-a82080e79632",
         "workflowRunID": "a6ec0229-7796-46fc-8df2-a03f4bddab47"
      },
      "runnerType": "RUNNER_TYPE_GITHUB_ACTION",
      "runnerURL": "https://github.com/chainloop-dev/bedrock/actions/runs/3411479373"
   }
}

```

Operators can also download artifacts, export Prometheus metrics and more!

```bash
$ chainloop artifact download -d sha256:f8a581d4bce57f792444b2230b5706a6f902fbac19a374e76f6a56f030d35cf2
INF downloading file name=rootfs.tar.gz to=/tmp/rootfs.tar.gz
INF file downloaded! path=/tmp/rootfs.tar.gz
```

At this point, the SecOps team has control of the attestation and artifacts expectations (via Workflow contracts), which can be updated at any time with new requirements.

They also gained visibility, and have all the metadata and artifacts meeting the latest standards and best practices, while developers have been shielded from most of the complexity related to this process.
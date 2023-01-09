---
sidebar_position: 2
title: Account Setup
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import Image from "@theme/IdealImage";

The attestation metadata and artifacts created by your workflows are **not stored in Chainloop but instead pushed to your [OCI registry](https://github.com/opencontainers/distribution-spec)**. That's why to have a fully functional Chainloop account, an OCI repository must be added.

<Image img={require("./chainloop-parts.png")} className="light-mode-only" />
<Image img={require("./chainloop-parts-dark.png")} className="dark-mode-only" />

## Add OCI repository

Setup your OCI repository by executing

```bash
$ chainloop config set-oci-repo --repo [REPO_URI] \
                                --username [USERNAME] \
                                --password [PASS]
```

Examples:

<Tabs>
  <TabItem value="gar" label="Google Artifact Registry" default>

```bash
  # Using json-based service account
  # https://console.cloud.google.com/iam-admin/serviceaccounts

  $ chainloop config set-oci-repo \
    # i.e us-east1-docker.pkg.dev/my-project/chainloop-cas-devel
    --repo [region]-docker.pkg.dev/[my-project]/[my-repository] \
    --username _json_key \
    --password "$(cat service-account.json)"
```

  </TabItem>

  <TabItem value="github" label="GitHub packages" default>

```bash
  # Using personal access token with write:packages permissions
  # https://github.com/settings/tokens

  $ chainloop config set-oci-repo \
    # i.e ghcr.io/chainloop-dev/chainloop-cas
    --repo ghcr.io/[username or org]/[my-repository] \
    --username [username] \
    --password [personal access token]
```

  </TabItem>
  <TabItem value="dockerhub" label="DockerHub" default>

```bash
# Create a personal access token at
# https://hub.docker.com/settings/security

$ chainloop config set-oci-repo \
    --repo index.docker.io/[username] \
    --username [username] \
    --password [personal access token]
```

  </TabItem>
  <TabItem value="ecr" label="AWS Container Registry" default>

:::caution
**AWS Container Registry is not supported yet**.
:::

  </TabItem>
</Tabs>

### Give it a try

If everything went well, you should be able to upload and download artifact materials, let's give it a try

```bash title="Upload a file to your OCI repository"
$ chainloop artifact upload -f myfile
myfile@sha256:c5cc0a2c712497c29f29c3ba11e7fcc0c3cc725ab591720db595e5d6469f3f37 ... done! [1.03KB in 0s; 5.48KB/s]
```

```bash title="Download by content digest (sha256)"
$ chainloop artifact download -d sha256:c5cc0a2c712497c29f29c3ba11e7fcc0c3cc725ab591720db595e5d6469f3f37
INF downloading file name=myfile to=/tmp/myfile
INF file downloaded! path=/tmp/myfile
```

## Review configuration

You can check your current context at any time by running

```bash
$ chainloop config current-context
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ Current Context                                                                      │
├───────────────────┬──────────────────────────────────────────────────────────────────┤
│ Logged in as      │ miguel@chainloop.dev                                             │
├───────────────────┼──────────────────────────────────────────────────────────────────┤
│ Organization ID   │ fe1c7a81-089a-4473-8084-4f963395be0d                             │
│ Organization name │ Miguels main org                                     │
├───────────────────┼──────────────────────────────────────────────────────────────────┤
│ OCI repository    │ europe-west1-docker.pkg.dev/redacted**********6622/chainloop-cas │
└───────────────────┴──────────────────────────────────────────────────────────────────┘
```

Everything looks good, we are all set!

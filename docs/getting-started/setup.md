---
sidebar_position: 3
title: Setup
---

:::info
Make sure you've been granted access to the private Beta otherwise request access [here](/getting-started/private-beta)
:::

## Authentication

Once the ChainLoop CLI is installed, next you'll need to authenticate

```bash
$ chainloop auth login
```

## Add OCI repository

You need to provide OCI registry credentials to store the attestations as well as their associated artifact materials.

```bash
$ chainloop config set-oci-repo --repo [REPO_URI] --username [USERNAME] --password [PASS] 
```

:::caution
**AWS Container Registry is not supported yet**.
:::


```bash title="Example: Google Artifact Registry using a json-based service account"
$ chainloop config set-oci-repo \
    --repo us-east1-docker.pkg.dev/my-project/chainloop-cas-devel \
    --username _json_key \
    --password "$(cat service-account.json)" # https://console.cloud.google.com/iam-admin/serviceaccounts
```

```bash title="Example: DockerHub"
$ chainloop config set-oci-repo \
    --repo index.docker.io/[username] \
    --username [username] \
    --password [personal access token] # https://hub.docker.com/settings/security
```



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

Everything looks good so we are all set!
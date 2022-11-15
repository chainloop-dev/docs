---
sidebar_position: 2
title: Installation
---

First, you need to have the Chainloop CLI installed on your computer. Use the command below to **install the latest version and verify its signature**.

```bash
curl -sfL https://chainloop.dev/install.sh | bash -s
```

Checking the file provenance requires `cosign` to be present in your system, you can install it from [here](https://docs.sigstore.dev/cosign/installation/), or alternatively, you can skip the verification via the `--skip-verification` flag (not recommended).

```bash
curl -sfL https://chainloop.dev/install.sh | bash -s -- --skip-verification
```

You can also get a specific version

```bash
curl -sfL https://chainloop.dev/install.sh | bash -s -- --version v0.1.2
```
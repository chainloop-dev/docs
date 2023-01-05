---
sidebar_position: 1
title: CLI Download
---

:::info
Chainloop's control plane runs as Software as a Service (SaaS) but we are **committed to making it open source so you can run your own instance**. Stay tuned!
:::

First, you need to have the Chainloop CLI installed on your computer. Use the command below to **download the latest version** and check its integrity.

```bash
curl -sfL https://chainloop.dev/install.sh | bash -s
```

or a specific version with

```bash
curl -sfL https://chainloop.dev/install.sh | bash -s -- --version v0.1.2
```

if [`cosign`](https://docs.sigstore.dev/cosign) is present in your system, in addition to the checksum check, a signature verification will be performed. This behavior can be enforced via the `--force-verification` flag.

```bash
curl -sfL https://chainloop.dev/install.sh | bash -s -- --force-verification
```

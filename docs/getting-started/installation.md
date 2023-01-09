---
sidebar_position: 1
title: Installation
---

:::info
Chainloop's control plane runs as Software as a Service (SaaS) but we are **committed to making it open source so you can run your own instance**.

If you have any questions, concerns or comments feel free to [reach out](https://us21.list-manage.com/contact-form?u=801f42b3abafc40b1a17c5f25&form_id=3f3bbfe15e6fcd4a60be9b966652cfd5)
:::

Chainloop is comprised of two main components

- A Control Plane that runs as a **free open beta** Software as a Service (SaaS)
- A Command Line Interface (CLI) used to both a) operate on the control plane and b) run the attestation process on your CI/CD

## Command Line Interface (CLI) download

To **download the latest version** for macOS, Linux or Windows (using [WSL](https://learn.microsoft.com/en-us/windows/wsl/install)) just run

```bash
curl -sfL https://chainloop.dev/install.sh | bash -s
```

you can retrieve a specific version with

```bash
curl -sfL https://chainloop.dev/install.sh | bash -s -- --version v0.1.2
```

if [`cosign`](https://docs.sigstore.dev/cosign) is present in your system, in addition to the checksum check, a signature verification will be performed. This behavior can be enforced via the `--force-verification` flag.

```bash
curl -sfL https://chainloop.dev/install.sh | bash -s -- --force-verification
```

## Authentication

Authenticate to the Control Plane with Single Sign-on

```bash
$ ./chainloop auth login
```

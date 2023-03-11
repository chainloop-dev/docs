# Chainloop Cloud

:::caution
Chainloop is under active development, please don't use it as part of your critical infrastructure until it reaches the 1.0 release.
:::

Chainloop Cloud is a **free, public beta, Software as a Service instance of [Chainloop](https://github.com/chainloop-dev/chainloop)**. It's available to whoever wants to give Chainloop a try without the effort of [deploying their own instance](https://github.com/chainloop-dev/chainloop).

The Chainloop **Command Line Interface (CLI) comes pre-configured to use the Chainloop cloud control plane**.

```sh
$ chainloop config view
control-plane: api.cp.chainloop.dev:443
artifact-cas: api.cas.chainloop.dev:443
```

But you can easily configure the CLI to point to your own Chainloop instance by using the `config save` command.

```sh
chainloop config save --control-plane my-controlplane.acme.com --artifact-cas cas.acme.com
```

If you prefer to run your own instance, you can find the instructions to do so in the [project repository](https://github.com/chainloop-dev/chainloop).

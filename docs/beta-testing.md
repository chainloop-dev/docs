---
sidebar_position: 7
---

# Beta Testers

:::caution
ChainLoop is under active development, please don't use it as part of your critical infrastructure until it reaches the 1.0 release.
:::

First of all, **thank you for trying out ChainLoop**! Although we are in the early stages, we are hungry for feedback so **your contribution as an early user is invaluable**.

If you have chosen to giving ChainLoop a try, this page is for you. It will contain tips, caveats and other pieces of information related to the beta testing process.

### CLI graceful exit

Although ChainLoop is under active development, we want you to try it out and integrate it into your CI/CD systems safely.

That's why the `attestation` subcommand will **by default exit 0** in the case of an error. This option will make sure that your CI/CD pipelines will keep working during potential transient errors.

If you feel adventurous and want to make sure that the attestation process is finished correctly, you can override this behavior by setting the flag `--graceful-exit=false`

```bash
$ chainloop att
Usage:
  chainloop attestation [command]

Aliases:
  attestation, att

Available Commands:
  ...

Flags:
      # highlight-next-line
      --graceful-exit   exit 0 in case of error. NOTE: this behavior will change once 1.0 is reached (default true)
```

### Contact/Feedback

We would love to hear from you, any thoughts, requests, issues your encountered, or even compliments :)

Please send those our way through [this contact form](https://us21.list-manage.com/contact-form?u=801f42b3abafc40b1a17c5f25&form_id=3f3bbfe15e6fcd4a60be9b966652cfd5) or [email](mailto:feedback@chainloop.dev).

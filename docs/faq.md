---
sidebar_position: 6
---

# Frequently Asked Questions

#### Is Chainloop Open Source?

Yes, Chainloop source code has been Open Sourced and can be found [here](https://github.com/chainloop-dev/chainloop)! 🎉

#### Can I run my own instance of Chainloop end to end?

Yes, please refer to the deployment instructions that can be found in [this repository](https://github.com/chainloop-dev/chainloop)

#### In this documentation site there are references to Chainloop Cloud, what is it?

Chainloop cloud is an available, running instance of Chainloop. For more information refer to the [Chainloop Cloud page](./chainloop-cloud).

#### I am using neither GitHub Actions nor GitLab, can I still use Chainloop?

Yes, Chainloop is runner agnostic, which means that you can run the attestation anywhere, including your laptop!

That said, there are [benefits](/reference/operator/contract#runner-context) for using one of our [supported runner types](/reference/operator/contract#runner-context). We plan on supporting more CI vendors so your is not supported yet, please [contact us](https://us21.list-manage.com/contact-form?u=801f42b3abafc40b1a17c5f25&form_id=3f3bbfe15e6fcd4a60be9b966652cfd5) with your preference and we will get back to you.

#### Does Chainloop store my Artifacts and Attestation metadata?

No. They are stored in [your OCI Registry](/getting-started/setup#add-oci-repository).

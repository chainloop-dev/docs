// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "ChainLoop documentation",
  tagline: "The Software Supply Chain Attestation Solution that makes sense",
  url: "https://docs.chainloop.dev",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/logo-clear.svg",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: [
    [
      "@docusaurus/plugin-ideal-image",
      {
        quality: 70,
        max: 1030, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
        disableInDev: false,
      },
    ],
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        gtag: {
          trackingID: "G-G4XVJP8LEP",
        },
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          sidebarCollapsed: false,
          // Docs only mode
          routeBasePath: "/",
          editUrl: "https://github.com/chainloop-dev/docs/tree/main",
        },
        blog: {
          showReadingTime: true,
          blogTitle: "ChainLoop blog",
          blogDescription: "ChainLoop blog",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/logo.svg",
      navbar: {
        title: "ChainLoop documentation",
        logo: {
          alt: "Chainloop Logo",
          srcDark: "img/logo-clear.svg",
          src: "img/logo.svg",
        },
        items: [
          { to: "blog", label: "Blog", position: "right" }, // or position: 'right'
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            label: "Contact",
            href: "https://us21.list-manage.com/contact-form?u=801f42b3abafc40b1a17c5f25&form_id=3f3bbfe15e6fcd4a60be9b966652cfd5",
          },
          {
            label: "Blog",
            to: "blog",
          },
          {
            label: "Github",
            href: "https://github.com/chainloop-dev",
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["log", "cue"],
      },
      metadata: [
        {
          name: "keywords",
          content:
            "software supply chain, security, attestation, slsa, sigstore",
        },
      ],
    }),
};

module.exports = config;

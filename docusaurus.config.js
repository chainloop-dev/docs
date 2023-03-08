// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Chainloop documentation",
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
          blogTitle: "Chainloop blog",
          blogDescription: "Chainloop blog",
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
      algolia: {
        appId: "80E4FPODSO",
        // Public API key: it is safe to commit it
        apiKey: "2757faaa5b66256f54f2f84fe4005a4a",
        indexName: "chainloop",
        // Optional: see doc section below
        contextualSearch: true,
      },
      image: "img/logo.svg",
      navbar: {
        title: "Chainloop documentation",
        logo: {
          alt: "Chainloop Logo",
          srcDark: "img/logo-clear.svg",
          src: "img/logo.svg",
        },
        items: [
          {
            to: "blog",
            label: "Blog",
            position: "right",
          },
          {
            href: "https://github.com/chainloop-dev/chainloop",
            position: "right",
            className: "header-github-link",
            "aria-label": "GitHub repository",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            label: "Main site",
            href: "https://chainloop.dev",
          },
          {
            label: "Contact",
            href: "https://us21.list-manage.com/contact-form?u=801f42b3abafc40b1a17c5f25&form_id=3f3bbfe15e6fcd4a60be9b966652cfd5",
          },
          {
            label: "Blog",
            to: "blog",
          },
          {
            label: "GitHub",
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
            "software supply chain, security, attestation, slsa, sigstore, in-toto",
        },
      ],
    }),
  scripts: [],
};

module.exports = config;

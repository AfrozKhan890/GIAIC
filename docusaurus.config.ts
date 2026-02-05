import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'From Neural Networks to Physical Intelligence',
  favicon: 'img/brain-chip.svg',

  // url: 'https://afrozkhan890.github.io',
  url: 'https://physical-ai-book.vercel.app',
  baseUrl: '/',
  // baseUrl: '/physical-ai-book/',

  organizationName: 'Afrozkhan890',
  projectName: 'physical-ai-book',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/neural-network-og.jpg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '🧠 Physical AI',
      logo: {
        alt: 'Neural Robotics Logo',
        src: 'img/logo.jpg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '📚 Chapters',
        },
        {to: '/about', label: '📖 About', position: 'left'},
        {to: '/resources', label: '🛠️ Resources', position: 'left'},
        {to: '/projects', label: '⚡ Projects', position: 'left'},
        {
          href: 'https://github.com/Afrozkhan890/physical-ai-book',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'Neural AI Logo',
        src: 'img/logo.jpg',
        width: 60,
        height: 60,
      },
      links: [
        {
          title: 'Textbook',
          items: [
            {label: 'Chapters', to: '/'},
            {label: 'About', to: '/about'},
            {label: 'Resources', to: '/resources'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'Panaversity', href: 'https://panaversity.org'},
            {label: 'GitHub', href: 'https://github.com/panaversity'},
            {label: 'Discord', href: 'https://discord.gg/panaversity'},
          ],
        },
        {
          title: 'Hackathon',
          items: [
            {label: 'Submit Project', href: 'https://forms.gle/CQsSEGM3GeCrL43c8'},
            {label: 'Live Presentation', href: 'https://us06web.zoom.us/j/84976847088'},
            {label: 'Spec-Kit Plus', href: 'https://github.com/panaversity/spec-kit-plus'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Neural Physical AI Textbook. Built for Panaversity Hackathon.`,
    },
    prism: {
      theme: prismThemes.vsDark,
      darkTheme: prismThemes.vsDark,
    },
    algolia: {
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_API_KEY',
      indexName: 'physical-ai',
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
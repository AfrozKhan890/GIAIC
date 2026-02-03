import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: '🧠 Physical AI Textbook',
      items: [
        'intro',
        'chapter1',
        'chapter2',
        'chapter3',
        'chapter4',
        'chapter5',
        'chapter6',
        'chapter7',
        'chapter8',
        'chapter9',
        'chapter10',
      ],
    },
    {
      type: 'category',
      label: '📖 Additional Pages',
      items: [
        'about',
        'resources',
        'projects',
        'blog',
        'faq',
        'contact',
      ],
    },
  ],
};

export default sidebars;
import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'chapter1', // This matches chapter1.md
      label: 'Chapter 1: Introduction to Physical AI',
    },
    {
      type: 'doc',
      id: 'chapter2',
      label: 'Chapter 2: ROS 2 Fundamentals',
    },
    {
      type: 'doc',
      id: 'chapter3',
      label: 'Chapter 3: Gazebo Simulation',
    },
    {
      type: 'doc',
      id: 'chapter4',
      label: 'Chapter 4: NVIDIA Isaac Platform',
    },
    {
      type: 'doc',
      id: 'chapter5',
      label: 'Chapter 5: Humanoid Robot Development',
    },
  ],
};

export default sidebars;
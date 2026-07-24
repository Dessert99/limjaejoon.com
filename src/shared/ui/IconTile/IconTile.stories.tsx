/** IconTile 상태 문서 — GitHub·LinkedIn 외부 링크 예시 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { IconTile } from './IconTile';

const meta = {
  title: 'shared/ui/IconTile',
  component: IconTile,
} satisfies Meta<typeof IconTile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const GitHub: Story = {
  args: {
    icon: FaGithub,
    href: 'https://github.com/Dessert99',
    ariaLabel: 'GitHub',
  },
};

export const LinkedIn: Story = {
  args: {
    icon: FaLinkedin,
    href: 'https://www.linkedin.com/in/jae-joon-lim/',
    ariaLabel: 'LinkedIn',
  },
};

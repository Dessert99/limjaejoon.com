/** Switch 상태 문서 — 기본, 켜짐 기본값, 비활성 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Switch } from './Switch';

const meta = { title: 'shared/ui/Switch' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <Switch.Root aria-label='알림'>
        <Switch.Thumb />
      </Switch.Root>
    );
  },
};

export const On: Story = {
  render: () => {
    return (
      <Switch.Root
        aria-label='알림'
        defaultChecked>
        <Switch.Thumb />
      </Switch.Root>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <Switch.Root
        aria-label='알림'
        disabled>
        <Switch.Thumb />
      </Switch.Root>
    );
  },
};

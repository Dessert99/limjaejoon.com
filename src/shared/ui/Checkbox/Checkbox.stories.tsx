/** Checkbox 상태 문서 — 기본, 체크됨, indeterminate */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Checkbox } from './Checkbox';

const meta = { title: 'shared/ui/Checkbox' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <Checkbox.Root aria-label='동의'>
        <Checkbox.Indicator>✓</Checkbox.Indicator>
      </Checkbox.Root>
    );
  },
};

export const Checked: Story = {
  render: () => {
    return (
      <Checkbox.Root
        aria-label='동의'
        defaultChecked>
        <Checkbox.Indicator>✓</Checkbox.Indicator>
      </Checkbox.Root>
    );
  },
};

export const Indeterminate: Story = {
  render: () => {
    return (
      <Checkbox.Root
        aria-label='전체'
        checked='indeterminate'>
        <Checkbox.Indicator>−</Checkbox.Indicator>
      </Checkbox.Root>
    );
  },
};

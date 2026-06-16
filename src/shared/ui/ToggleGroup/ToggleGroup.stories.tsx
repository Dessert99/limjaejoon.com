/** ToggleGroup 상태 문서 — single(정렬), multiple(스타일) */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ToggleGroup } from './ToggleGroup';

const meta = { title: 'shared/ui/ToggleGroup' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: () => (
    <ToggleGroup.Root
      type='single'
      aria-label='정렬'
      defaultValue='left'>
      <ToggleGroup.Item value='left'>왼쪽</ToggleGroup.Item>
      <ToggleGroup.Item value='center'>가운데</ToggleGroup.Item>
      <ToggleGroup.Item value='right'>오른쪽</ToggleGroup.Item>
    </ToggleGroup.Root>
  ),
};

export const Multiple: Story = {
  render: () => (
    <ToggleGroup.Root
      type='multiple'
      aria-label='스타일'>
      <ToggleGroup.Item value='bold'>B</ToggleGroup.Item>
      <ToggleGroup.Item value='italic'>I</ToggleGroup.Item>
      <ToggleGroup.Item value='underline'>U</ToggleGroup.Item>
    </ToggleGroup.Root>
  ),
};

/** Select 상태 문서 — 4테마 중 하나를 고르는 폼 셀렉트 (Value=현재값, Item=옵션) */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Select } from './Select';

const meta = { title: 'shared/ui/Select' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const THEMES = [
  { value: 'afternoon', label: '오후' },
  { value: 'sunset', label: '노을' },
  { value: 'night', label: '밤' },
  { value: 'dawn', label: '새벽' },
];

export const Default: Story = {
  render: () => {
    return (
      <Select.Root>
        <Select.Trigger aria-label='테마'>
          <Select.Value placeholder='테마 선택' />
          <Select.Icon>▾</Select.Icon>
        </Select.Trigger>
        <Select.Content>
          {THEMES.map((theme) => {
            return (
              <Select.Item
                key={theme.value}
                value={theme.value}>
                <Select.ItemText>{theme.label}</Select.ItemText>
                <Select.ItemIndicator>✓</Select.ItemIndicator>
              </Select.Item>
            );
          })}
        </Select.Content>
      </Select.Root>
    );
  },
};

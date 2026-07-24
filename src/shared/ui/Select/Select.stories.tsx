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

/** 데모 옵션 — Value가 선택 표시로 재사용할 ItemText와 선택 표식을 함께 둔다 */
function ThemeItems() {
  return (
    <>
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
    </>
  );
}

export const Default: Story = {
  render: () => {
    return (
      <Select.Root>
        <Select.Trigger aria-label='테마'>
          <Select.Value placeholder='테마 선택' />
          <Select.Icon>▾</Select.Icon>
        </Select.Trigger>
        <Select.Content>
          <ThemeItems />
        </Select.Content>
      </Select.Root>
    );
  },
};

export const Selected: Story = {
  render: () => {
    return (
      <Select.Root defaultValue='night'>
        <Select.Trigger aria-label='테마'>
          <Select.Value placeholder='테마 선택' />
          <Select.Icon>▾</Select.Icon>
        </Select.Trigger>
        <Select.Content>
          <ThemeItems />
        </Select.Content>
      </Select.Root>
    );
  },
};

export const Invalid: Story = {
  render: () => {
    return (
      <div>
        <Select.Root>
          <Select.Trigger
            aria-label='테마'
            aria-describedby='theme-error'
            invalid>
            <Select.Value placeholder='테마 선택' />
            <Select.Icon>▾</Select.Icon>
          </Select.Trigger>
          <Select.Content>
            <ThemeItems />
          </Select.Content>
        </Select.Root>
        <p id='theme-error'>테마를 선택해 주세요.</p>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <Select.Root disabled>
        <Select.Trigger aria-label='테마'>
          <Select.Value placeholder='테마 선택' />
          <Select.Icon>▾</Select.Icon>
        </Select.Trigger>
        <Select.Content>
          <ThemeItems />
        </Select.Content>
      </Select.Root>
    );
  },
};

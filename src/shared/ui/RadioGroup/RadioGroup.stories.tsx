/** RadioGroup 상태 문서 — 라벨과 함께 단일선택 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Label } from '../Label/Label';
import { RadioGroup } from './RadioGroup';

const meta = { title: 'shared/ui/RadioGroup' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <RadioGroup.Root
        aria-label='요금제'
        defaultValue='free'>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RadioGroup.Item
            id='r-free'
            value='free'>
            <RadioGroup.Indicator />
          </RadioGroup.Item>
          <Label htmlFor='r-free'>무료</Label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RadioGroup.Item
            id='r-pro'
            value='pro'>
            <RadioGroup.Indicator />
          </RadioGroup.Item>
          <Label htmlFor='r-pro'>프로</Label>
        </div>
      </RadioGroup.Root>
    );
  },
};

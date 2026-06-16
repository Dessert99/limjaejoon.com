/** Label 상태 문서 — 기본, 컨트롤 연결 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Label } from './Label';

const meta = {
  title: 'shared/ui/Label',
  component: Label,
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: '이메일' } };

export const WithControl: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Label htmlFor='email'>이메일</Label>
        <input
          id='email'
          placeholder='you@example.com'
        />
      </div>
    );
  },
};

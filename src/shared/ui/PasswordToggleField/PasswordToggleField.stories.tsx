/** PasswordToggleField 상태 문서 — 비밀번호 입력 + 보기/숨기기 토글 (⚠️ unstable API) */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PasswordToggleField } from './PasswordToggleField';

const meta = { title: 'shared/ui/PasswordToggleField' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <PasswordToggleField.Root>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <PasswordToggleField.Input
            aria-label='비밀번호'
            placeholder='비밀번호'
          />
          <PasswordToggleField.Toggle>
            <PasswordToggleField.Slot
              visible='숨기기'
              hidden='보기'
            />
          </PasswordToggleField.Toggle>
        </div>
      </PasswordToggleField.Root>
    );
  },
};

/** OneTimePasswordField 상태 문서 — 6칸 인증코드 입력, 자동 이동·붙여넣기 분배는 Radix가 (⚠️ unstable API) */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OneTimePasswordField } from './OneTimePasswordField';

const meta = { title: 'shared/ui/OneTimePasswordField' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return <OneTimePasswordField length={6} />;
  },
};

/** Progress 상태 문서 — 진행 중, 완료, indeterminate */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Progress } from './Progress';

const meta = {
  title: 'shared/ui/Progress',
  component: Progress,
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Half: Story = { args: { value: 50, 'aria-label': '업로드' } };

export const Complete: Story = { args: { value: 100, 'aria-label': '업로드' } };

export const Indeterminate: Story = { args: { 'aria-label': '대기' } };

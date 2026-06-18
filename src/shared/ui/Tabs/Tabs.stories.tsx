/** Tabs 상태 문서 — 기본 가로 탭(자동 활성화) */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tabs } from './Tabs';

const meta = { title: 'shared/ui/Tabs' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <Tabs.Root defaultValue='overview'>
        <Tabs.List aria-label='프로젝트'>
          <Tabs.Trigger value='overview'>개요</Tabs.Trigger>
          <Tabs.Trigger value='specs'>사양</Tabs.Trigger>
          <Tabs.Trigger value='reviews'>리뷰</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value='overview'>프로젝트 개요입니다.</Tabs.Content>
        <Tabs.Content value='specs'>기술 사양입니다.</Tabs.Content>
        <Tabs.Content value='reviews'>사용자 리뷰입니다.</Tabs.Content>
      </Tabs.Root>
    );
  },
};

/** Menubar 상태 문서 — 데스크톱식 가로 메뉴바, 트리거 사이를 ←→로 이동 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Menubar } from './Menubar';

const meta = { title: 'shared/ui/Menubar' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <Menubar.Root>
        <Menubar.Menu>
          <Menubar.Trigger>파일</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Label>문서</Menubar.Label>
            <Menubar.Item>새 글</Menubar.Item>
            <Menubar.Item>가져오기</Menubar.Item>
            <Menubar.Separator />
            <Menubar.Item>내보내기</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
        <Menubar.Menu>
          <Menubar.Trigger>편집</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item>실행 취소</Menubar.Item>
            <Menubar.Item>다시 실행</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
        <Menubar.Menu>
          <Menubar.Trigger>보기</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item>미리보기</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
      </Menubar.Root>
    );
  },
};

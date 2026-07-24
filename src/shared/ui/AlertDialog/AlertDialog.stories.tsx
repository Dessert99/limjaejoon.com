/** AlertDialog 상태 문서 — 확인 흐름 anatomy와 액션 layout */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '../Button/Button';
import { AlertDialog } from './AlertDialog';

const meta = { title: 'shared/ui/AlertDialog' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/** Natural layout — 취소/확인 액션이 자연 폭으로 가운데 정렬된다 */
export const LayoutNatural: Story = {
  render: () => {
    return (
      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <Button variant='neutralOutline'>글 삭제</Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>정말 삭제할까요?</AlertDialog.Title>
            <AlertDialog.Description>
              삭제한 글은 복구할 수 없습니다.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer layout='natural'>
            <AlertDialog.Cancel asChild>
              <Button variant='ghost'>취소</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button variant='criticalSolid'>삭제</Button>
            </AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    );
  },
};

/** Single layout — 확인 하나만 필요한 흐름에서 액션을 세로 폭으로 채운다 */
export const LayoutSingle: Story = {
  render: () => {
    return (
      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <Button variant='neutralOutline'>공지 보기</Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>업데이트 안내</AlertDialog.Title>
            <AlertDialog.Description>
              새 기능을 확인했습니다. 확인을 누르면 대화가 닫힙니다.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer layout='single'>
            <AlertDialog.Action asChild>
              <Button variant='neutralSolid'>확인</Button>
            </AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    );
  },
};

/** Natural overflow — 긴 액션 라벨이 들어와도 natural layout은 줄바꿈으로 버틴다 */
export const NaturalOverflow: Story = {
  render: () => {
    return (
      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <Button variant='neutralOutline'>긴 액션 확인</Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>변경 사항을 적용할까요?</AlertDialog.Title>
            <AlertDialog.Description>
              액션 문구가 길어지는 실제 화면에서도 버튼 영역이 패널 밖으로
              넘치지 않아야 합니다.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer layout='natural'>
            <AlertDialog.Cancel asChild>
              <Button variant='ghost'>나중에 다시 검토하기</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button variant='criticalSolid'>
                모든 연결된 데이터를 삭제하고 계속하기
              </Button>
            </AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    );
  },
};

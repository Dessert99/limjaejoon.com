/** Dialog 상태 문서 — 일반 모달 anatomy와 닫기/저장 액션 layout */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '../Button/Button';
import { Dialog } from './Dialog';

const meta = { title: 'shared/ui/Dialog' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/** Default — 정보 확인이나 짧은 설정 흐름에 쓰는 일반 모달 */
export const Default: Story = {
  render: () => {
    return (
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button variant='neutralOutline'>프로필 수정</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>프로필 수정</Dialog.Title>
            <Dialog.Description>
              이름과 소개를 변경할 수 있습니다.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            블로그 작성자 정보처럼 위험하지 않은 일반 설정 흐름에 사용합니다.
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close asChild>
              <Button variant='ghost'>닫기</Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button variant='brandSolid'>저장</Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    );
  },
};

/** SingleAction — 닫기 하나만 필요한 정보성 모달 */
export const SingleAction: Story = {
  render: () => {
    return (
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button variant='neutralOutline'>안내 보기</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>작성 팁</Dialog.Title>
            <Dialog.Description>
              글 작성 화면에서 참고할 수 있는 짧은 안내입니다.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            일반 Dialog는 사용자가 내용을 확인한 뒤 자연스럽게 닫을 수 있는
            흐름에 적합합니다.
          </Dialog.Body>
          <Dialog.Footer layout='single'>
            <Dialog.Close asChild>
              <Button variant='neutralSolid'>확인</Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    );
  },
};

/** OverflowActions — 긴 액션 문구는 footer 폭 안에서 세로로 쌓인다 */
export const OverflowActions: Story = {
  render: () => {
    return (
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button variant='neutralOutline'>긴 액션 보기</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>표시 옵션 변경</Dialog.Title>
            <Dialog.Description>
              액션 문구가 길어져도 버튼 영역이 패널 밖으로 넘치지 않아야 합니다.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            일반 Dialog는 파괴적 확인보다 설정, 편집, 상세 보기처럼 닫기 경로가
            자유로운 흐름을 담습니다.
          </Dialog.Body>
          <Dialog.Footer layout='single'>
            <Dialog.Close asChild>
              <Button variant='ghost'>기본 설정으로 되돌리고 닫기</Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button variant='brandSolid'>
                현재 표시 옵션을 저장하고 계속하기
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    );
  },
};

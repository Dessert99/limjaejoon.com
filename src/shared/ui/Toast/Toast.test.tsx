import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Toast } from './Toast';

// Provider + 전역 Viewport 안에 제어형(open) 토스트 하나 — 동작 검증용 공통 마크업
function renderToast(onOpenChange?: (open: boolean) => void) {
  return render(
    <Toast.Provider>
      <Toast.Root
        open
        onOpenChange={onOpenChange}>
        <Toast.Title>저장됨</Toast.Title>
        <Toast.Description>변경사항이 저장되었습니다.</Toast.Description>
        <Toast.Close>닫기</Toast.Close>
      </Toast.Root>
      <Toast.Viewport />
    </Toast.Provider>
  );
}

describe('Toast', () => {
  it('열린 토스트가 뷰포트 목록에 제목·설명과 함께 뜬다', () => {
    renderToast();

    // 실제 토스트는 Viewport(ol)로 포털된 li — role="status"는 스크린리더용 별도 announce 영역
    const toast = screen.getByRole('listitem');
    expect(toast).toHaveTextContent('저장됨');
    expect(toast).toHaveTextContent('변경사항이 저장되었습니다.');
  });

  it('Close 버튼을 누르면 onOpenChange(false)가 불린다', async () => {
    const onOpenChange = vi.fn();
    renderToast(onOpenChange);

    await userEvent.click(screen.getByRole('button', { name: '닫기' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

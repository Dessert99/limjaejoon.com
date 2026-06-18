import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Menubar } from './Menubar';

// 파일·편집 두 메뉴짜리 메뉴바 — 동작 검증용 공통 마크업
function renderMenubar(onSelect?: (event: Event) => void) {
  return render(
    <Menubar.Root>
      <Menubar.Menu>
        <Menubar.Trigger>파일</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item onSelect={onSelect}>새로 만들기</Menubar.Item>
          <Menubar.Separator />
          <Menubar.Item>열기</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>편집</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item>실행 취소</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar.Root>
  );
}

describe('Menubar', () => {
  it('트리거를 클릭하면 해당 메뉴가 열린다', async () => {
    renderMenubar();

    const fileTrigger = screen.getByRole('menuitem', { name: '파일' });
    expect(fileTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await userEvent.click(fileTrigger);

    expect(fileTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: '새로 만들기' })
    ).toBeInTheDocument();
  });

  it('항목을 선택하면 onSelect가 호출되고 메뉴가 닫힌다', async () => {
    const onSelect = vi.fn();
    renderMenubar(onSelect);

    await userEvent.click(screen.getByRole('menuitem', { name: '파일' }));
    await userEvent.click(
      screen.getByRole('menuitem', { name: '새로 만들기' })
    );

    expect(onSelect).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('여러 트리거가 menubar로 묶인다', () => {
    renderMenubar();

    expect(screen.getByRole('menubar')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '파일' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '편집' })).toBeInTheDocument();
  });
});

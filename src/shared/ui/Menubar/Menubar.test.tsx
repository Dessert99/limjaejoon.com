import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Menubar } from './Menubar';

function renderMenubar() {
  return render(
    <Menubar.Root className='menubar-root'>
      <Menubar.Menu>
        <Menubar.Trigger className='menubar-trigger'>파일</Menubar.Trigger>
      </Menubar.Menu>
    </Menubar.Root>
  );
}

describe('Menubar', () => {
  it('Root와 Trigger에 외부 className을 병합한다', () => {
    renderMenubar();

    expect(screen.getByRole('menubar')).toHaveClass('menubar-root');
    expect(screen.getByRole('menuitem', { name: '파일' })).toHaveClass(
      'menubar-trigger'
    );
  });
});

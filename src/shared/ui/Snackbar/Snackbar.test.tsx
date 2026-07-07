import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Snackbar } from './Snackbar';

describe('Snackbar', () => {
  it('message를 status 알림으로 렌더링한다', () => {
    render(
      <Snackbar.Provider>
        <Snackbar.Root
          open
          message='복사됐어요'
        />
        <Snackbar.Viewport />
      </Snackbar.Provider>
    );

    expect(screen.getByText('복사됐어요').closest('[role="status"]'))
      .toBeVisible();
  });

  it('actionLabel과 onAction으로 보조 액션을 연결한다', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(
      <Snackbar.Provider>
        <Snackbar.Root
          open
          message='저장됐어요'
          actionLabel='되돌리기'
          onAction={onAction}
        />
        <Snackbar.Viewport />
      </Snackbar.Provider>
    );

    await user.click(screen.getByRole('button', { name: '되돌리기' }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });
});

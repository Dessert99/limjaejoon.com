import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { OneTimePasswordField } from './OneTimePasswordField';

describe('OneTimePasswordField', () => {
  it('length만큼 입력 칸을 group으로 렌더한다', () => {
    render(<OneTimePasswordField length={4} />);

    expect(screen.getByRole('group')).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(4);
  });

  it('한 칸에 입력하면 값이 들어가고 다음 칸으로 포커스가 넘어간다', async () => {
    render(<OneTimePasswordField length={4} />);
    const inputs = screen.getAllByRole('textbox');

    await userEvent.type(inputs[0], '1');

    expect(inputs[0]).toHaveValue('1');
    expect(inputs[1]).toHaveFocus();
  });
});

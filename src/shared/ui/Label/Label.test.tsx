import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Label } from './Label';

describe('Label', () => {
  it('htmlFor로 지정한 컨트롤에 연결된 라벨을 렌더한다', () => {
    render(
      <>
        <Label htmlFor='email'>이메일</Label>
        <input id='email' />
      </>
    );

    expect(screen.getByText('이메일')).toHaveAttribute('for', 'email');
  });

  it('라벨을 클릭하면 연결된 컨트롤로 포커스가 이동한다', async () => {
    render(
      <>
        <Label htmlFor='email'>이메일</Label>
        <input id='email' />
      </>
    );

    await userEvent.click(screen.getByText('이메일'));

    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('외부 className을 내부 클래스와 병합한다', () => {
    render(<Label className='extra'>이름</Label>);

    expect(screen.getByText('이름')).toHaveClass('extra');
  });
});

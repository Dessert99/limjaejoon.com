/** Container 테스트 — 폭 계약과 소비자 className 덮어쓰기만 검증한다 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Container } from './Container';

describe('Container', () => {
  it('children 을 렌더한다', () => {
    render(<Container>본문</Container>);

    expect(screen.getByText('본문')).toBeInTheDocument();
  });

  it('기본 폭은 content 다', () => {
    render(<Container data-testid='container'>본문</Container>);

    expect(screen.getByTestId('container')).toHaveClass('max-w-content');
  });

  it("size='wide' 면 wide 폭을 쓴다", () => {
    render(
      <Container
        size='wide'
        data-testid='container'>
        본문
      </Container>
    );

    const container = screen.getByTestId('container');

    expect(container).toHaveClass('max-w-wide');
    expect(container).not.toHaveClass('max-w-content');
  });

  it('소비자 className 이 기본 폭을 덮어쓴다', () => {
    render(
      <Container
        className='max-w-none'
        data-testid='container'>
        본문
      </Container>
    );

    const container = screen.getByTestId('container');

    expect(container).toHaveClass('max-w-none');
    expect(container).not.toHaveClass('max-w-content');
  });
});

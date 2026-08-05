/** BlobButton 테스트 — 이동 계약과, 스크립트 없이도 blob 이 보이는 계약을 검증한다 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BlobButton } from './BlobButton';

describe('BlobButton', () => {
  it('텍스트를 이름으로 갖는 링크를 렌더한다', () => {
    render(<BlobButton href='/work'>Work</BlobButton>);

    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute(
      'href',
      '/work'
    );
  });

  it('blob 모양을 서버 렌더 결과에 이미 담는다', () => {
    const { container } = render(<BlobButton href='/work'>Work</BlobButton>);

    expect(container.querySelector('path')).toHaveAttribute(
      'd',
      expect.stringContaining('M')
    );
  });
});

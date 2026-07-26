/** IntroSection 테스트 — 조립 계약만 검증한다. 파랄랙스 자체는 브라우저 육안 확인 대상 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { profile } from '@/entities/profile';
import { IntroSection } from './IntroSection';

describe('IntroSection', () => {
  it('이름을 페이지 최상위 제목으로 노출한다', () => {
    render(<IntroSection />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      profile.name
    );
  });

  it('역할 헤드라인을 함께 보여준다', () => {
    render(<IntroSection />);

    expect(screen.getByText(profile.headline)).toBeInTheDocument();
  });

  it('소개 문구를 전부 렌더한다', () => {
    render(<IntroSection />);

    for (const line of profile.taglines) {
      expect(screen.getByText(line)).toBeInTheDocument();
    }
  });

  it('배경 실루엣을 함께 깐다', () => {
    const { container } = render(<IntroSection />);

    expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
  });
});

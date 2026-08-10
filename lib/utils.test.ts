/** cn 테스트 — tailwind-merge 가 우리 토큰 이름을 어떤 그룹으로 보는지가 계약이다 */
import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('text 크기와 text 색은 다른 속성이라 함께 남는다', () => {
    expect(cn('text-hero', 'text-muted-foreground')).toBe(
      'text-hero text-muted-foreground'
    );
  });

  it('이름 붙은 text 크기끼리는 뒤에 온 것만 남긴다', () => {
    expect(cn('text-hero', 'text-body')).toBe('text-body');
  });

  it('이름 붙은 spacing 유틸리티끼리는 뒤에 온 것만 남긴다', () => {
    expect(cn('px-gutter', 'px-section')).toBe('px-section');
  });

  it('이름 붙은 container 유틸리티끼리는 뒤에 온 것만 남긴다', () => {
    expect(cn('max-w-content', 'max-w-wide')).toBe('max-w-wide');
  });

  it('이름 붙은 easing 유틸리티끼리는 뒤에 온 것만 남긴다', () => {
    expect(cn('ease-reveal', 'ease-standard')).toBe('ease-standard');
  });

  it('이름 붙은 duration 유틸리티끼리는 뒤에 온 것만 남긴다', () => {
    expect(cn('duration-slow', 'duration-quick')).toBe('duration-quick');
  });

  it('소비자가 덧붙인 클래스가 컴포넌트 기본값을 이긴다', () => {
    expect(cn('bg-card px-gutter', 'bg-secondary')).toBe(
      'px-gutter bg-secondary'
    );
  });
});

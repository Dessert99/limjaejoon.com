/** ContactSection 테스트 — 연락 수단이 실제로 닿는지를 검증한다 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EMAIL } from '@/shared/config';
import { CONTACT } from '../../config/contact';
import { ContactSection } from './ContactSection';

describe('ContactSection', () => {
  it('메일 주소로 가는 링크를 준다', () => {
    render(<ContactSection />);

    expect(screen.getByRole('link', { name: CONTACT.cta })).toHaveAttribute(
      'href',
      `mailto:${EMAIL}`
    );
  });

  it('주소를 눈으로도 읽을 수 있게 남긴다', () => {
    // 메일 클라이언트가 없는 환경에서 mailto 는 아무 일도 안 한다 — 주소가 화면에 있어야 복사할 수 있다
    render(<ContactSection />);

    expect(screen.getByText(EMAIL)).toBeInTheDocument();
  });
});

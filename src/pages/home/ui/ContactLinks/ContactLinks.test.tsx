import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ContactLinks } from './ContactLinks';

describe('ContactLinks', () => {
  it('연락처를 aria-label 있는 링크 목록으로 렌더한다', () => {
    render(
      <ContactLinks
        contacts={[
          { kind: 'github', href: 'https://github.com/x', label: 'GitHub' },
        ]}
      />
    );
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/x'
    );
  });
});

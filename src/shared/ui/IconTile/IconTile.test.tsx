import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FaGithub } from 'react-icons/fa';
import { IconTile } from './IconTile';

describe('IconTile', () => {
  it('aria-label과 href를 가진 외부 링크로 렌더한다', () => {
    render(
      <IconTile
        icon={FaGithub}
        href='https://github.com/example'
        ariaLabel='GitHub'
      />
    );

    const link = screen.getByRole('link', { name: 'GitHub' });
    expect(link).toHaveAttribute('href', 'https://github.com/example');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

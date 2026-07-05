'use client';

/** 라이트/다크 테마 전환 토글 버튼 — 클릭 한 번으로 반대 테마 적용·저장 */
import { Button } from '@/shared/ui';
import { useTheme } from '../../model/useTheme';
import { themeToggle } from './ThemeToggle.css';

/** 현재 테마의 반대로 전환하는 플로팅 버튼 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <Button
      variant='ghost'
      size='sm'
      className={themeToggle}
      aria-label={next === 'dark' ? '다크 테마로 전환' : '라이트 테마로 전환'}
      onClick={() => {
        return setTheme(next);
      }}>
      {theme === 'dark' ? '🌙' : '☀️'}
    </Button>
  );
}

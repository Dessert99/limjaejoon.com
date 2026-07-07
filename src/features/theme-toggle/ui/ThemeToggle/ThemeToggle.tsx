'use client';

/** 라이트/다크 테마 전환 토글 버튼 — 클릭 한 번으로 반대 테마 적용·저장 */
import { Button } from '@/shared/ui';
import { withCircularReveal } from '../../lib/withCircularReveal';
import { useTheme } from '../../model/useTheme';
import { themeToggle } from './ThemeToggle.css';

/** 현재 테마의 반대로 전환하는 플로팅 버튼 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <Button
      variant='ghost'
      size='small'
      layout='iconOnly'
      className={themeToggle}
      aria-label={next === 'dark' ? '다크 테마로 전환' : '라이트 테마로 전환'}
      onClick={(event) => {
        // 확산 원의 중심 = 버튼 중앙 — 클릭 픽셀보다 눈에 안정적
        const rect = event.currentTarget.getBoundingClientRect();
        withCircularReveal(
          () => {
            return setTheme(next);
          },
          { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        );
      }}>
      {theme === 'dark' ? '🌙' : '☀️'}
    </Button>
  );
}

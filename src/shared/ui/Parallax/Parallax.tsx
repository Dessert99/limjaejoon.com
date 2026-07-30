/** 스크롤 패럴랙스 — translate 만 소유한다(축약형 transform 을 안 써야 다른 층이 scale 을 얹을 수 있다) */
import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/lib';

/** 강도는 제 높이 기준 백분율로 CSS 가 해석한다 — 본문 텍스트에는 subtle 만 쓴다 */
type ParallaxProps = ComponentPropsWithRef<'div'> & {
  strength?: 'subtle' | 'normal' | 'strong';
};

/** 스크롤에 연속으로 물리는 층 — 상태가 없어 JS 없이 CSS view timeline 만으로 돈다 */
export function Parallax({
  strength = 'normal',
  className,
  children,
  ...rest
}: ParallaxProps) {
  return (
    // 애니메이션은 data-parallax 셀렉터가 건다 — 클래스로 걸면 소비자의 animate-* 가 같은 레이어에서 되덮는다
    <div
      data-parallax={strength}
      className={cn(className)}
      {...rest}>
      {children}
    </div>
  );
}

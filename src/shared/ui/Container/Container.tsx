/** 레이아웃 컨테이너 — 최대 폭과 좌우 gutter 만 소유한다(자식 배치에는 관여하지 않는다) */
import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/lib';

/** 폭은 두 가지뿐 — 그 밖의 폭이 필요하면 소비자가 className 으로 덮는다 */
type ContainerProps = ComponentPropsWithRef<'div'> & {
  size?: 'content' | 'wide';
};

const SIZE_CLASS = {
  content: 'max-w-content',
  wide: 'max-w-wide',
} as const;

/** 섹션 안쪽 콘텐츠를 가운데로 모으는 기본 래퍼 */
export function Container({
  size = 'content',
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full px-gutter', SIZE_CLASS[size], className)}
      {...props}>
      {children}
    </div>
  );
}

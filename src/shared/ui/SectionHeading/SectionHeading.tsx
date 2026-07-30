/** 섹션 머리말 — eyebrow·제목·부연을 한 덩어리로 묶어 섹션마다 heading 계층이 흔들리지 않게 한다 */
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cn } from '@/shared/lib';

/** level 은 2·3 만 연다 — h1 은 페이지에 하나뿐이라 섹션이 가져가면 안 된다 */
type SectionHeadingProps = Omit<ComponentPropsWithRef<'div'>, 'title'> & {
  label?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  level?: 2 | 3;
};

const HEADING_TAG = { 2: 'h2', 3: 'h3' } as const;

/** 섹션 상단에 놓는 제목 묶음 */
export function SectionHeading({
  label,
  title,
  description,
  level = 2,
  className,
  ...rest
}: SectionHeadingProps) {
  const Heading = HEADING_TAG[level];

  return (
    <div
      className={cn('flex flex-col gap-4', className)}
      {...rest}>
      {label ? (
        <p className='text-label text-subtle uppercase'>{label}</p>
      ) : null}
      {/* break-keep — 한글은 어절 중간에서 끊기면 읽기가 급격히 나빠진다 */}
      <Heading className='text-section break-keep'>{title}</Heading>
      {description ? (
        <p className='text-body-lg break-keep text-muted'>{description}</p>
      ) : null}
    </div>
  );
}

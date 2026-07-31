/** 섹션 머리말 — Root·Label·Title·Description 부품으로 나눠 배치를 소비자가 소유한다 */
import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/lib';

/** level 은 2·3 만 연다 — h1 은 페이지에 하나뿐이라 섹션이 가져가면 안 된다 */
type SectionHeadingTitleProps = ComponentPropsWithRef<'h2'> & {
  level?: 2 | 3;
};

const HEADING_TAG = { 2: 'h2', 3: 'h3' } as const;

/** 머리말 기본 배치 — 소비자가 className 으로 그리드로 덮을 수 있다 */
function SectionHeadingRoot({
  className,
  ...rest
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-4', className)}
      {...rest}
    />
  );
}

/** 섹션 라벨 — 머리말 역할의 text-label 계열을 단독으로 소유한다 */
function SectionHeadingLabel({
  className,
  ...rest
}: ComponentPropsWithRef<'p'>) {
  return (
    <p
      className={cn('text-label text-subtle uppercase', className)}
      {...rest}
    />
  );
}

/** 섹션 제목 — id 는 여기 붙는다. 래퍼에 붙이면 이름이 라벨·부연까지 번진다 */
function SectionHeadingTitle({
  level = 2,
  className,
  ...rest
}: SectionHeadingTitleProps) {
  const Heading = HEADING_TAG[level];

  // break-keep — 한글은 어절 중간에서 끊기면 읽기가 급격히 나빠진다
  return (
    <Heading
      className={cn('text-section break-keep', className)}
      {...rest}
    />
  );
}

/** 제목 아래 부연 */
function SectionHeadingDescription({
  className,
  ...rest
}: ComponentPropsWithRef<'p'>) {
  return (
    <p
      className={cn('text-body-lg break-keep text-muted', className)}
      {...rest}
    />
  );
}

/** 섹션 머리말 부품 묶음 — 소비자가 필요한 것만 골라 조립한다 */
export const SectionHeading = {
  Root: SectionHeadingRoot,
  Label: SectionHeadingLabel,
  Title: SectionHeadingTitle,
  Description: SectionHeadingDescription,
};

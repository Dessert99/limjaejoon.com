/** 기본 액션 — 링크 역할과 버튼 역할을 타입으로 갈라 <a> 와 <button> 을 섞지 않는다 */
import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/lib';

/** 두 역할이 공유하는 시각 축 — 조합이 2×2 라 CVA 없이 매핑 객체로 충분하다 */
export type ButtonStyleProps = {
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md';
};

/** href 유무가 판별자 — 버튼 쪽에 href?: never 를 둬야 실수로 섞어 쓴 조합이 타입에서 걸린다 */
type ButtonProps =
  | (ButtonStyleProps & ComponentPropsWithRef<'button'> & { href?: never })
  | (ButtonStyleProps & ComponentPropsWithRef<'a'> & { href: string });

// 포커스 링은 global.css 의 :focus-visible 이 이미 소유한다 — 여기서 다시 정의하지 않는다
const BASE_CLASS =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition duration-quick ease-standard disabled:pointer-events-none disabled:opacity-50';

const VARIANT_CLASS = {
  solid: 'bg-accent text-accent-foreground hover:bg-accent-hover',
  outline:
    'border border-border-strong text-foreground hover:border-accent hover:text-accent',
} as const;

const SIZE_CLASS = {
  sm: 'px-4 py-2 text-body-sm',
  md: 'px-6 py-3 text-body',
} as const;

/** 화면 어디서든 쓰는 기본 액션 — 이동이면 href 를, 동작이면 onClick 을 준다 */
export function Button({
  variant = 'solid',
  size = 'md',
  className,
  ...rest
}: ButtonProps) {
  const classes = cn(
    BASE_CLASS,
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    className
  );

  // 'href' in rest 로 보지 않는다 — href={undefined} 를 넘긴 버튼이 href 없는 <a> 로 새어 나간다
  if (rest.href !== undefined) {
    return (
      <a
        className={classes}
        {...rest}
      />
    );
  }

  // type 은 rest 뒤에 둔다 — 앞에 두면 type={undefined} 가 속성을 지워 form 안에서 submit 으로 되살아난다
  return (
    <button
      className={classes}
      {...rest}
      type={rest.type ?? 'button'}
    />
  );
}

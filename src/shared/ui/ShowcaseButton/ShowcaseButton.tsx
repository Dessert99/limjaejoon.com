/** 강조 액션 — 내부 fill 레이어(translate)와 루트 scale 만 소유한다(magnetic·커서 추적은 쓰지 않는다) */
import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/lib';

/** Button 과 같은 판별 규칙 — href 유무로 이동과 동작을 가른다 */
type ShowcaseButtonProps =
  | (ComponentPropsWithRef<'button'> & { href?: never })
  | (ComponentPropsWithRef<'a'> & { href: string });

// overflow-hidden 이 fill 레이어를 가둔다 — 이게 없으면 아래에서 올라오는 면이 버튼 밖으로 새어 보인다
const ROOT_CLASS =
  'group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-border-strong px-8 py-4 text-body-lg font-medium text-foreground transition duration-quick ease-standard active:scale-98 hover:text-accent-foreground focus-visible:text-accent-foreground disabled:pointer-events-none disabled:opacity-50';

// hover 뿐 아니라 focus-visible 에도 건다 — 키보드 사용자가 같은 상태 신호를 받아야 한다
const FILL_CLASS =
  'absolute inset-0 translate-y-full bg-accent transition-transform duration-standard ease-reveal group-hover:translate-y-0 group-focus-visible:translate-y-0';

const LABEL_CLASS =
  'relative transition-transform duration-standard ease-reveal group-hover:-translate-y-px';

/** Hero·Introduction·Contact 처럼 시선을 잡아야 하는 자리의 CTA */
export function ShowcaseButton({
  className,
  children,
  ...rest
}: ShowcaseButtonProps) {
  const classes = cn(ROOT_CLASS, className);
  const content = (
    <>
      <span
        aria-hidden='true'
        className={FILL_CLASS}
      />
      <span className={LABEL_CLASS}>{children}</span>
    </>
  );

  // href={undefined} 를 넘긴 버튼이 href 없는 <a> 로 새어 나가지 않게 값으로 판별한다
  if (rest.href !== undefined) {
    return (
      <a
        className={classes}
        {...rest}>
        {content}
      </a>
    );
  }

  // type 은 rest 뒤에 둔다 — 앞에 두면 type={undefined} 가 속성을 지워 form 안에서 submit 으로 되살아난다
  return (
    <button
      className={classes}
      {...rest}
      type={rest.type ?? 'button'}>
      {content}
    </button>
  );
}

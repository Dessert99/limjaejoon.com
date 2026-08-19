import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils';

type ShowcaseButtonProps =
  | (ComponentPropsWithRef<'button'> & { href?: never })
  | (ComponentPropsWithRef<'a'> & { href: string });

const ROOT_CLASS =
  'group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-input px-8 py-4 text-body-lg font-medium text-foreground transition duration-quick ease-standard active:scale-98 hover:text-primary-foreground focus-visible:text-primary-foreground disabled:pointer-events-none disabled:opacity-50';

const FILL_CLASS =
  'absolute inset-0 translate-y-full bg-primary transition-transform duration-standard ease-reveal group-hover:translate-y-0 group-focus-visible:translate-y-0';

const LABEL_CLASS =
  'relative transition-transform duration-standard ease-reveal group-hover:-translate-y-px';

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

  if (rest.href !== undefined) {
    return (
      <a
        className={classes}
        {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button
      className={classes}
      {...rest}
      type={rest.type ?? 'button'}>
      {content}
    </button>
  );
}

/** 공용 Button — native button 기본, asChild면 Radix Slot으로 자식에 합성 */
import { Slot } from 'radix-ui'; // Radix 합성 컴포넌트
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react'; // 부모가 넘긴 ref를 실제 DOM요소까지 전달해준다.
import {
  block as blockClass,
  button,
  content,
  icon,
  loadingLayer,
  prefixIcon,
  spinner,
  suffixIcon,
  type ButtonVariants,
} from './Button.css';

/** 표준 button 속성 + 시각 변형 + 상태 + asChild 합성 플래그 */
export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>, // 기본 button속성을 전부 받을 수 있다.
    // Vanilla문법
    ButtonVariants {
  asChild?: boolean;
  loading?: boolean;
  block?: boolean;
}

/** icon slot 공통 props */
type ButtonIconSlotProps = ComponentPropsWithoutRef<'span'> & {
  children: ReactNode;
};

/** PrefixIcon — 텍스트 앞에 붙는 장식 아이콘 slot */
const PrefixIcon = forwardRef<HTMLSpanElement, ButtonIconSlotProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={[prefixIcon, className].filter(Boolean).join(' ')}
        aria-hidden
        {...props}
      />
    );
  }
);
PrefixIcon.displayName = 'Button.PrefixIcon';

/** SuffixIcon — 텍스트 뒤에 붙는 장식 아이콘 slot */
const SuffixIcon = forwardRef<HTMLSpanElement, ButtonIconSlotProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={[suffixIcon, className].filter(Boolean).join(' ')}
        aria-hidden
        {...props}
      />
    );
  }
);
SuffixIcon.displayName = 'Button.SuffixIcon';

/** Icon — iconOnly layout 의 단일 아이콘 slot */
const Icon = forwardRef<HTMLSpanElement, ButtonIconSlotProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={[icon, className].filter(Boolean).join(' ')}
        aria-hidden
        {...props}
      />
    );
  }
);
Icon.displayName = 'Button.Icon';

/** loading 표시 — 버튼 이름은 content layer 가 유지하므로 indicator 는 숨긴다 */
function LoadingIndicator() {
  return (
    <span
      className={loadingLayer}
      aria-hidden>
      <span className={spinner} />
    </span>
  );
}

/** asChild=true면 Slot.Root, 아니면 button을 렌더하고 recipe 클래스를 외부 className과 병합 */
const ButtonRoot = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size,
      layout,
      loading = false,
      disabled = false,
      asChild = false,
      block = false,
      type,
      className,
      children,
      ...props
    },
    ref
  ) => {
    if (
      process.env.NODE_ENV !== 'production' &&
      layout === 'iconOnly' &&
      !props['aria-label'] &&
      !props['aria-labelledby']
    ) {
      console.warn(
        "Button layout='iconOnly' requires aria-label or aria-labelledby."
      );
    }

    const classNames = [button({ variant, size, layout }), block ? blockClass : null, className]
      .filter(Boolean)
      .join(' ');

    if (asChild) {
      return (
        <Slot.Root
          ref={ref}
          className={classNames}
          aria-busy={loading || undefined}
          aria-disabled={disabled ? true : props['aria-disabled']}
          data-loading={loading ? '' : undefined}
          data-disabled={disabled ? '' : undefined}
          {...props}>
          {children}
        </Slot.Root>
      );
    }

    return (
      <button
        ref={ref}
        className={classNames}
        type={type ?? 'button'}
        disabled={disabled}
        aria-busy={loading || undefined}
        data-loading={loading ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        {...props}>
        <span className={content}>{children}</span>
        {loading ? <LoadingIndicator /> : null}
      </button>
    );
  }
);

ButtonRoot.displayName = 'Button';

/** compound Button public API */
export const Button = Object.assign(ButtonRoot, {
  PrefixIcon,
  SuffixIcon,
  Icon,
});

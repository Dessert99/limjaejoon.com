/** 공용 Button — native button 기본, asChild면 Radix Slot으로 자식에 합성 */
import { Slot } from 'radix-ui'; // Radix 합성 컴포넌트
import { forwardRef } from 'react'; // 부모가 넘긴 ref를 실제 DOM요소까지 전달해준다.
import { button, type ButtonVariants } from './Button.css';

/** 표준 button 속성 + 시각 변형 + asChild 합성 플래그 */
export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>, // 기본 button속성을 전부 받을 수 있다.
    // Vanilla문법
    ButtonVariants {
  asChild?: boolean;
}

/** asChild=true면 Slot.Root, 아니면 button을 렌더하고 recipe 클래스를 외부 className과 병합 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, asChild = false, className, children, ...props }, ref) => {
    // asChild면 자식 엘리먼트로 교체 — ref 타입은 기본(button) 기준이라 실제 엘리먼트와 다를 수 있음
    const Comp = asChild ? Slot.Root : 'button';
    return (
      <Comp
        ref={ref}
        className={[button({ variant, size }), className]
          .filter(Boolean)
          .join(' ')}
        {...props}>
        {children}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

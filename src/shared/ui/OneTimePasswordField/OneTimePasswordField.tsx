/** 공용 OneTimePasswordField — Radix(unstable) OTP 필드를 번들해 N칸 인증코드 입력을 만든다 */
import { unstable_OneTimePasswordField as OneTimePasswordFieldPrimitive } from 'radix-ui'; // 칸 간 자동 이동·붙여넣기 분배·한 번에 지우기·one-time-code 자동완성을 Radix가 처리 (⚠️ unstable API)
import { forwardRef } from 'react';
import { input, root } from './OneTimePasswordField.css';

/** 인증코드 입력 — length개 칸 + 폼 전송용 HiddenInput을 묶는다(소비자는 length·name만) */
export const OneTimePasswordField = forwardRef<
  React.ComponentRef<typeof OneTimePasswordFieldPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof OneTimePasswordFieldPrimitive.Root> & {
    length?: number;
  }
>(({ length = 6, className, ...props }, ref) => {
  return (
    <OneTimePasswordFieldPrimitive.Root
      ref={ref}
      className={[root, className].filter(Boolean).join(' ')}
      {...props}>
      {Array.from({ length }).map((_, index) => {
        return (
          <OneTimePasswordFieldPrimitive.Input
            key={index}
            className={input}
          />
        );
      })}
      <OneTimePasswordFieldPrimitive.HiddenInput />
    </OneTimePasswordFieldPrimitive.Root>
  );
});
OneTimePasswordField.displayName = 'OneTimePasswordField';

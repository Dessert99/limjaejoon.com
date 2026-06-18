/** 공용 PasswordToggleField — Radix(unstable) 비밀번호 가시성 토글 필드 */
import { unstable_PasswordToggleField as PasswordToggleFieldPrimitive } from 'radix-ui'; // 입력 type(password↔text) 토글·포커스/선택 보존·토글 aria-label 자동 전환을 Radix가 처리 (⚠️ unstable API)
import { forwardRef } from 'react';
import { input, toggle } from './PasswordToggleField.css';

/** 묶음 — 가시성(visible) 상태 컨텍스트만 제공(DOM 없음) */
const Root = PasswordToggleFieldPrimitive.Root;

/** 입력 — visible에 따라 type이 password↔text로 바뀌는 비밀번호 입력 */
const Input = forwardRef<
  React.ComponentRef<typeof PasswordToggleFieldPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof PasswordToggleFieldPrimitive.Input>
>(({ className, ...props }, ref) => {
  return (
    <PasswordToggleFieldPrimitive.Input
      ref={ref}
      className={[input, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Input.displayName = 'PasswordToggleField.Input';

/** 토글 — 가시성을 뒤집는 버튼(aria-label이 Show/Hide password로 자동 전환) */
const Toggle = forwardRef<
  React.ComponentRef<typeof PasswordToggleFieldPrimitive.Toggle>,
  React.ComponentPropsWithoutRef<typeof PasswordToggleFieldPrimitive.Toggle>
>(({ className, ...props }, ref) => {
  return (
    <PasswordToggleFieldPrimitive.Toggle
      ref={ref}
      className={[toggle, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Toggle.displayName = 'PasswordToggleField.Toggle';

/** 아이콘 — 가시성에 따라 visible/hidden 두 svg 중 하나를 그린다(글리프는 소비자 몫) */
const Icon = PasswordToggleFieldPrimitive.Icon;

/** 슬롯 — 가시성에 따라 visible/hidden 노드를 바꿔 그린다(아이콘 대신 텍스트 등) */
const Slot = PasswordToggleFieldPrimitive.Slot;

/** 네임스페이스 — Root·Input·Toggle·Icon·Slot */
export const PasswordToggleField = { Root, Input, Toggle, Icon, Slot };

/** 공용 Snackbar — 짧은 결과 피드백을 message 중심 API로 노출한다 */
import { Toast as ToastPrimitive } from 'radix-ui'; // 큐·자동 닫힘 타이머·스와이프 dismiss·live region 알림은 Radix Toast가 처리
import { forwardRef } from 'react';
import {
  action,
  messageText,
  root,
  viewport,
} from './Snackbar.css';

/** Snackbar.Provider — 앱 또는 화면 루트에서 duration·swipeDirection을 설정한다 */
const Provider = ToastPrimitive.Provider;

/** Snackbar.Viewport — Snackbar가 쌓이는 전역 알림 영역 */
const Viewport = forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => {
  return (
    <ToastPrimitive.Viewport
      ref={ref}
      className={[viewport, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Viewport.displayName = 'Snackbar.Viewport';

type SnackbarVariant = 'default' | 'positive' | 'critical';

type SnackbarRootProps = Omit<
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>,
  'children'
> & {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: SnackbarVariant;
};

/** Snackbar.Root — message와 짧은 action만 허용해 피드백 패턴을 좁게 유지한다 */
const Root = forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Root>,
  SnackbarRootProps
>(
  (
    {
      className,
      message,
      actionLabel,
      onAction,
      role,
      variant = 'default',
      ...props
    },
    ref
  ) => {
    return (
      <ToastPrimitive.Root
        ref={ref}
        role={role ?? 'status'}
        className={[root({ variant }), className].filter(Boolean).join(' ')}
        {...props}>
        <ToastPrimitive.Title className={messageText}>
          {message}
        </ToastPrimitive.Title>
        {actionLabel ? (
          <ToastPrimitive.Action
            altText={actionLabel}
            asChild>
            <button
              className={action}
              type='button'
              onClick={onAction}>
              {actionLabel}
            </button>
          </ToastPrimitive.Action>
        ) : null}
      </ToastPrimitive.Root>
    );
  }
);
Root.displayName = 'Snackbar.Root';

/** 네임스페이스 — Provider·Viewport·Root */
export const Snackbar = { Provider, Viewport, Root };

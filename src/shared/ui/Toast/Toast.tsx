/** 공용 Toast — Radix Toast 위에 알림 카드·전역 뷰포트 스타일만 입힌 토스트 알림 */
import { Toast as ToastPrimitive } from 'radix-ui'; // 큐·자동 닫힘 타이머·스와이프 dismiss·live region 알림을 Radix가 처리
import { forwardRef } from 'react';
import { description, root, title, viewport } from './Toast.css';

/** 제공자 — 앱 루트에 한 번. 큐·기본 duration·스와이프 방향 컨텍스트 제공(DOM 없음) */
const Provider = ToastPrimitive.Provider;

/** 뷰포트 — 토스트가 쌓이는 전역 고정 위치(role="region"), 앱 루트에 한 번 둔다 */
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
Viewport.displayName = 'Toast.Viewport';

/** 토스트 — 한 장의 알림(role="status"), open으로 표시하고 duration 후 자동 닫힘 */
const Root = forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <ToastPrimitive.Root
      ref={ref}
      className={[root, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Root.displayName = 'Toast.Root';

/** 제목 — 알림 헤드라인 */
const Title = forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => {
  return (
    <ToastPrimitive.Title
      ref={ref}
      className={[title, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Title.displayName = 'Toast.Title';

/** 설명 — 보조 문구 */
const Description = forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => {
  return (
    <ToastPrimitive.Description
      ref={ref}
      className={[description, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Description.displayName = 'Toast.Description';

/** 액션 — 토스트 안의 행동 버튼(altText 필수=스크린리더용 대체 문구), 스타일은 asChild로 소비자 몫 */
const Action = ToastPrimitive.Action;

/** 닫기 — 토스트를 즉시 닫는 버튼, 스타일은 asChild로 소비자 몫 */
const Close = ToastPrimitive.Close;

/** 네임스페이스 — Provider·Viewport·Root·Title·Description·Action·Close */
export const Toast = {
  Provider,
  Viewport,
  Root,
  Title,
  Description,
  Action,
  Close,
};

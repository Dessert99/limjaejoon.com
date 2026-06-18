/** 공용 Dialog — Radix Dialog 위에 스크림·중앙 패널 스타일만 입힌 모달 */
import { Dialog as DialogPrimitive } from 'radix-ui'; // 포커스 트랩·스크롤 잠금·Esc/바깥클릭 닫기·dialog aria를 Radix가 처리
import { forwardRef } from 'react';
import { content, description, overlay, title } from './Dialog.css';

/** 묶음 — 열림 상태 컨텍스트만 제공(DOM 없음) */
const Root = DialogPrimitive.Root;

/** 트리거 — 모달을 여는 버튼(aria-haspopup="dialog"·aria-expanded), 스타일은 asChild로 소비자 몫 */
const Trigger = DialogPrimitive.Trigger;

/** 패널 — Portal과 스크림(Overlay)을 내장해 소비자는 Content 안에 본문만 둔다 */
const Content = forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={overlay} />
      <DialogPrimitive.Content
        ref={ref}
        className={[content, className].filter(Boolean).join(' ')}
        {...props}>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});
Content.displayName = 'Dialog.Content';

/** 제목 — h2로 렌더돼 aria-labelledby로 다이얼로그 이름이 된다(접근성상 권장) */
const Title = forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={[title, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Title.displayName = 'Dialog.Title';

/** 설명 — aria-describedby로 연결되는 보조 문구 */
const Description = forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={[description, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Description.displayName = 'Dialog.Description';

/** 닫기 — 클릭하면 모달을 닫는 버튼, 스타일은 asChild로 소비자 몫 */
const Close = DialogPrimitive.Close;

/** 네임스페이스 — Root·Trigger·Content·Title·Description·Close (Portal·Overlay는 Content 내장) */
export const Dialog = { Root, Trigger, Content, Title, Description, Close };

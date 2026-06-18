/** 공용 AlertDialog — Radix AlertDialog 위에 스크림·중앙 패널 스타일만 입힌 확인 모달 */
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui'; // 포커스 트랩·스크롤 잠금·바깥클릭 차단·Cancel 기본 포커스·alertdialog aria를 Radix가 처리
import { forwardRef } from 'react';
import { content, description, overlay, title } from './AlertDialog.css';

/** 묶음 — 열림 상태 컨텍스트만 제공(DOM 없음) */
const Root = AlertDialogPrimitive.Root;

/** 트리거 — 확인 대화를 여는 버튼, 스타일은 asChild로 소비자 몫 */
const Trigger = AlertDialogPrimitive.Trigger;

/** 패널 — Portal과 스크림(Overlay)을 내장. 바깥클릭으로 안 닫히고 Cancel/Action 선택을 강제한다 */
const Content = forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay className={overlay} />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={[content, className].filter(Boolean).join(' ')}
        {...props}>
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Portal>
  );
});
Content.displayName = 'AlertDialog.Content';

/** 제목 — h2로 렌더돼 aria-labelledby로 확인 대화 이름이 된다 */
const Title = forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      className={[title, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Title.displayName = 'AlertDialog.Title';

/** 설명 — aria-describedby로 연결되는 보조 문구 */
const Description = forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      className={[description, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Description.displayName = 'AlertDialog.Description';

/** 확인 — 위험한 작업을 실행하고 닫는 버튼, 스타일은 asChild로 소비자 몫 */
const Action = AlertDialogPrimitive.Action;

/** 취소 — 열렸을 때 기본 포커스를 받는 안전한 버튼, 스타일은 asChild로 소비자 몫 */
const Cancel = AlertDialogPrimitive.Cancel;

/** 네임스페이스 — Root·Trigger·Content·Title·Description·Action·Cancel (Portal·Overlay는 Content 내장) */
export const AlertDialog = {
  Root,
  Trigger,
  Content,
  Title,
  Description,
  Action,
  Cancel,
};

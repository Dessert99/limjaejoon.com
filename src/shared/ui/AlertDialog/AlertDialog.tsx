/** 공용 AlertDialog — Radix AlertDialog 위에 스크림·중앙 패널 스타일만 입힌 확인 모달 */
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui'; // 포커스 트랩·스크롤 잠금·바깥클릭 차단·Cancel 기본 포커스·alertdialog aria를 Radix가 처리
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import {
  content,
  description,
  footer,
  footerControl,
  header,
  overlay,
  title,
  type FooterVariants,
} from './AlertDialog.css';

/** Footer props — 액션 배치 방식만 AlertDialog 의미로 노출한다 */
export interface AlertDialogFooterProps
  extends ComponentPropsWithoutRef<'div'>, FooterVariants {}

/** Action props — Radix Action 속성에 footer control 스타일 훅을 합성한다 */
type AlertDialogActionProps = ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Action
>;

/** Cancel props — Radix Cancel 속성에 footer control 스타일 훅을 합성한다 */
type AlertDialogCancelProps = ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Cancel
>;

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

/** 헤더 — Title과 Description을 확인 대화의 설명 영역으로 묶는다 */
const Header = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[header, className].filter(Boolean).join(' ')}
        {...props}
      />
    );
  }
);
Header.displayName = 'AlertDialog.Header';

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

/** 푸터 — 취소/확인 액션을 natural 또는 single 레이아웃으로 배치한다 */
const Footer = forwardRef<HTMLDivElement, AlertDialogFooterProps>(
  ({ className, layout = 'natural', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[footer({ layout }), className].filter(Boolean).join(' ')}
        data-layout={layout}
        {...props}
      />
    );
  }
);
Footer.displayName = 'AlertDialog.Footer';

/** 확인 — 위험한 작업을 실행하고 닫는 버튼, footer 안에서는 긴 문구 폭을 제한한다 */
const Action = forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Action>,
  AlertDialogActionProps
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Action
      ref={ref}
      className={[footerControl, className].filter(Boolean).join(' ')}
      {...props}
      data-alert-dialog-control='action'
    />
  );
});
Action.displayName = 'AlertDialog.Action';

/** 취소 — 열렸을 때 기본 포커스를 받는 안전한 버튼, footer 안에서는 긴 문구 폭을 제한한다 */
const Cancel = forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Cancel>,
  AlertDialogCancelProps
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Cancel
      ref={ref}
      className={[footerControl, className].filter(Boolean).join(' ')}
      {...props}
      data-alert-dialog-control='cancel'
    />
  );
});
Cancel.displayName = 'AlertDialog.Cancel';

/** 네임스페이스 — Root·Trigger·Content·Header·Title·Description·Footer·Action·Cancel */
export const AlertDialog = {
  Root,
  Trigger,
  Content,
  Header,
  Title,
  Description,
  Footer,
  Action,
  Cancel,
};

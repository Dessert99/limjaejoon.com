/** 공용 Dialog — Radix Dialog 위에 일반 모달 anatomy와 토큰 스타일을 입힌다 */
import { Dialog as DialogPrimitive } from 'radix-ui'; // 선언형 open·포커스 트랩·스크롤 잠금·dialog aria를 Radix가 처리
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import {
  body,
  content,
  description,
  footer,
  header,
  overlay,
  title,
  type FooterVariants,
} from './Dialog.css';

/** Footer props — 일반 모달 액션 배치만 public API로 노출한다 */
export interface DialogFooterProps
  extends ComponentPropsWithoutRef<'div'>, FooterVariants {}

/** 묶음 — open 상태 컨텍스트를 제공한다 */
const Root = DialogPrimitive.Root;

/** 트리거 — 일반 모달을 여는 버튼, 스타일은 asChild로 소비자 몫 */
const Trigger = DialogPrimitive.Trigger;

/** 패널 — Portal과 Overlay를 내장해 소비자는 모달 내용만 작성한다 */
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

/** 헤더 — Title과 Description을 dialog 설명 영역으로 묶는다 */
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
Header.displayName = 'Dialog.Header';

/** 제목 — h2로 렌더돼 dialog 이름이 된다 */
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

/** 본문 — 폼·설정·상세 내용을 header/footer와 분리한다 */
const Body = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[body, className].filter(Boolean).join(' ')}
        {...props}
      />
    );
  }
);
Body.displayName = 'Dialog.Body';

/** 푸터 — 일반 모달의 닫기·저장 같은 액션을 배치한다 */
const Footer = forwardRef<HTMLDivElement, DialogFooterProps>(
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
Footer.displayName = 'Dialog.Footer';

/** 닫기 — 일반 모달의 닫기 버튼, asChild로 Button과 합성한다 */
const Close = DialogPrimitive.Close;

/** 네임스페이스 — Root·Trigger·Content·Header·Title·Description·Body·Footer·Close */
export const Dialog = {
  Root,
  Trigger,
  Content,
  Header,
  Title,
  Description,
  Body,
  Footer,
  Close,
};

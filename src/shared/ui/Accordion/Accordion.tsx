/** 공용 Accordion — Radix primitive 위에 SEED식 배열 상태 API와 slot anatomy를 입힌 디스클로저 */
import { Accordion as AccordionPrimitive } from 'radix-ui'; // single/multiple·collapsible 상태·region aria·키보드를 Radix가 처리
import {
  forwardRef,
  type AriaAttributes,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from 'react';
import {
  body,
  content,
  contentInner,
  description,
  header,
  indicator,
  item,
  prefix,
  root,
  title,
  trigger,
} from './Accordion.css';

/** Root props — 열린 항목은 single/multiple 모두 string[] 계약으로 다룬다 */
export interface AccordionRootProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'defaultValue' | 'dir' | 'onChange'
> {
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
  multiple?: boolean;
  collapsible?: boolean;
  disabled?: boolean;
  dir?: 'ltr' | 'rtl';
  orientation?: AriaAttributes['aria-orientation'];
}

/** span slot 공통 props */
type AccordionSpanSlotProps = ComponentPropsWithoutRef<'span'>;

/** 묶음 — public API는 배열 상태로 받고 Radix single/multiple props로 변환한다 */
const Root = forwardRef<HTMLDivElement, AccordionRootProps>(
  (
    {
      className,
      values,
      defaultValues,
      onValuesChange,
      multiple = false,
      collapsible = false,
      ...props
    },
    ref
  ) => {
    const classNames = [root, className].filter(Boolean).join(' ');

    if (multiple) {
      return (
        <AccordionPrimitive.Root
          ref={ref}
          type='multiple'
          value={values}
          defaultValue={defaultValues}
          onValueChange={onValuesChange}
          className={classNames}
          {...props}
        />
      );
    }

    return (
      <AccordionPrimitive.Root
        ref={ref}
        type='single'
        value={values ? (values[0] ?? '') : undefined}
        defaultValue={defaultValues?.[0]}
        onValueChange={(nextValue) => {
          onValuesChange?.(nextValue ? [nextValue] : []);
        }}
        collapsible={collapsible}
        className={classNames}
        {...props}
      />
    );
  }
);
Root.displayName = 'Accordion.Root';

/** 항목 — 한 섹션(value 필수), 펼침 상태를 data-state로 보유 */
const Item = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Item>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={[item, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Item.displayName = 'Accordion.Item';

/** 헤더 — Radix가 heading(h3)으로 렌더해 트리거를 제목 의미로 감싼다 */
const Header = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Header>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Header>
>(({ className, ...props }, ref) => {
  return (
    <AccordionPrimitive.Header
      ref={ref}
      className={[header, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Header.displayName = 'Accordion.Header';

/** 트리거 — 열고닫는 버튼(aria-expanded·aria-controls를 Radix가 부여) */
const Trigger = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  return (
    <AccordionPrimitive.Trigger
      ref={ref}
      className={[trigger, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Trigger.displayName = 'Accordion.Trigger';

/** Prefix — trigger 라벨 앞에 붙는 장식/보조 slot */
const Prefix = forwardRef<HTMLSpanElement, AccordionSpanSlotProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={[prefix, className].filter(Boolean).join(' ')}
        aria-hidden
        {...props}
      />
    );
  }
);
Prefix.displayName = 'Accordion.Prefix';

/** Body — title/description 을 묶는 주 텍스트 slot */
const Body = forwardRef<HTMLSpanElement, AccordionSpanSlotProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={[body, className].filter(Boolean).join(' ')}
        {...props}
      />
    );
  }
);
Body.displayName = 'Accordion.Body';

/** Title — trigger 의 핵심 라벨 */
const Title = forwardRef<HTMLSpanElement, AccordionSpanSlotProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={[title, className].filter(Boolean).join(' ')}
        {...props}
      />
    );
  }
);
Title.displayName = 'Accordion.Title';

/** Description — title 을 보조하는 짧은 설명 */
const Description = forwardRef<HTMLSpanElement, AccordionSpanSlotProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={[description, className].filter(Boolean).join(' ')}
        {...props}
      />
    );
  }
);
Description.displayName = 'Accordion.Description';

/** Indicator — open 상태를 제자리 360도 회전으로 보여주는 내장 SVG 셰브론 slot */
const Indicator = forwardRef<HTMLSpanElement, AccordionSpanSlotProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={[indicator, className].filter(Boolean).join(' ')}
        aria-hidden
        {...props}>
        <svg
          width='16'
          height='16'
          viewBox='0 0 16 16'
          fill='none'
          aria-hidden>
          <path
            d='M4 6l4 4 4-4'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </span>
    );
  }
);
Indicator.displayName = 'Accordion.Indicator';

/** 패널 — Radix measured height 변수와 data-state를 가진 motion layer */
const Content = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, ...props }, ref) => {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={[content, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
Content.displayName = 'Accordion.Content';

/** ContentInner — height animation 과 본문 padding 책임을 분리한다 */
const ContentInner = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={[contentInner, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
ContentInner.displayName = 'Accordion.ContentInner';

/** 네임스페이스 — Root·Item·Header·Trigger·Prefix·Body·Title·Description·Indicator·Content·ContentInner */
export const Accordion = {
  Root,
  Item,
  Header,
  Trigger,
  Prefix,
  Body,
  Title,
  Description,
  Indicator,
  Content,
  ContentInner,
};

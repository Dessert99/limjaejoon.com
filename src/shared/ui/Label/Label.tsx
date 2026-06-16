/** 공용 Label — Radix Label 위에 타이포만 입힌 폼 라벨 */
import { Label as LabelPrimitive } from 'radix-ui'; // htmlFor 연결·더블클릭 텍스트선택 방지를 Radix가 처리
import { forwardRef } from 'react';
import { label } from './Label.css';

/** Radix Label.Root props + 외부 className 병합 */
type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;

/** label 요소를 렌더하고 연결된 컨트롤로 포커스를 넘긴다 */
export const Label = forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={[label, className].filter(Boolean).join(' ')}
    {...props}
  />
));

Label.displayName = 'Label';

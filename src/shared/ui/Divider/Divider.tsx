/** 공용 Divider — 기본은 의미 있는 hr, 필요할 때 div/li로 렌더링한다 */
import { forwardRef } from 'react';
import { divider, dividerColor, dividerThickness } from './Divider.css';

type DividerElement = 'div' | 'hr' | 'li';
type DividerOrientation = 'horizontal' | 'vertical';

type DividerProps = Omit<React.HTMLAttributes<HTMLElement>, 'color'> & {
  as?: DividerElement;
  color?: string;
  inset?: boolean;
  orientation?: DividerOrientation;
  thickness?: number | string;
};

/** Divider root — semantic separator와 장식용 요소 렌더링을 as로 분리한다 */
export const Divider = forwardRef<HTMLElement, DividerProps>(
  (
    {
      as: Component = 'hr',
      className,
      color,
      inset,
      orientation = 'horizontal',
      style,
      thickness,
      ...props
    },
    ref
  ) => {
    const inlineVars = {
      ...(color ? { [dividerColor]: color } : {}),
      ...(thickness
        ? { [dividerThickness]: formatThickness(thickness) }
        : {}),
    } as React.CSSProperties;

    return (
      <Component
        ref={ref as never}
        className={[divider, className].filter(Boolean).join(' ')}
        data-inset={inset ? '' : undefined}
        data-orientation={orientation}
        aria-orientation={
          orientation === 'vertical' ? 'vertical' : undefined
        }
        style={{ ...inlineVars, ...style }}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';

function formatThickness(thickness: number | string) {
  return typeof thickness === 'number' ? `${thickness}px` : thickness;
}

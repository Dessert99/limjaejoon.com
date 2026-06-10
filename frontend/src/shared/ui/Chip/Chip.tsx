import type { ButtonHTMLAttributes } from 'react';
import { Icon } from '@/shared/ui/Icon/Icon';
import { chip, type ChipVariants } from '@/shared/styles/recipes.css';

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & ChipVariants;

// MD3 칩. recipes.chip(assist/filter/input/suggestion + selected)의 얇은 래퍼.
// filter 칩이 selected 이면 앞에 check 글리프를 단다(compoundVariants 와 짝).
export function Chip({
  variant,
  selected,
  className,
  type = 'button',
  children,
  ...rest
}: ChipProps) {
  const recipeClass = chip({ variant, selected });
  return (
    <button
      type={type}
      aria-pressed={variant === 'filter' ? Boolean(selected) : undefined}
      className={className ? `${recipeClass} ${className}` : recipeClass}
      {...rest}>
      {variant === 'filter' && selected && (
        <Icon
          name='check'
          size={18}
        />
      )}
      {children}
    </button>
  );
}

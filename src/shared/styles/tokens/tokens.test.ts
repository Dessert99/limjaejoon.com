/** 디자인 토큰 foundation 계약 테스트 — light/dark semantic shape 누락을 막는다 */
import { describe, expect, it } from 'vitest';

import {
  darkColor,
  lightColor,
  typography,
  dimension,
  spacing,
  radius,
  duration,
  easing,
  motion,
} from '.';

const flattenKeys = (
  value: Record<string, unknown>,
  prefix = ''
): string[] => {
  return Object.entries(value).flatMap(([key, nested]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
      return flattenKeys(nested as Record<string, unknown>, path);
    }
    return [path];
  });
};

describe('design tokens', () => {
  it('light와 dark color semantic이 같은 key를 가진다', () => {
    expect(flattenKeys(lightColor)).toEqual(flattenKeys(darkColor));
  });

  it('green brand와 positive semantic을 둘 다 제공한다', () => {
    expect(lightColor.fg.brand).toMatch(/^#/);
    expect(lightColor.fg.positive).toMatch(/^#/);
    expect(darkColor.bg.brand).toMatch(/^#/);
    expect(darkColor.bg.positiveWeak).toMatch(/^#/);
  });

  it('typography semantic text style은 CSS text 속성을 가진다', () => {
    expect(typography.text.body).toMatchObject({
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize[16],
      lineHeight: typography.lineHeight.normal,
      fontWeight: typography.fontWeight.regular,
    });
    expect(typography.text.code.fontFamily).toBe(typography.fontFamily.mono);
  });

  it('dimension scale과 semantic spacing을 분리한다', () => {
    expect(dimension.x0_5).toBe('0.125rem');
    expect(dimension.x4).toBe('1rem');
    expect(spacing.globalGutter).toBe(dimension.x4);
    expect(spacing.cardPadding).toBe(dimension.x6);
  });

  it('radius와 motion semantic alias를 제공한다', () => {
    expect(radius.control).toBe(radius.r2);
    expect(radius.pill).toBe(radius.full);
    expect(motion.colorTransition.duration).toBe(duration.d3);
    expect(motion.controlFeedback.easing).toBe(easing.enter);
    expect(motion.themeReveal.duration).toBe('2000ms');
  });
});

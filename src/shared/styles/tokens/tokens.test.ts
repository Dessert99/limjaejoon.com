/** 디자인 토큰 foundation 계약 테스트 — light/dark semantic shape 누락을 막는다 */
import { describe, expect, it } from 'vitest';

import {
  darkColor,
  lightColor,
  palette,
  typography,
  dimension,
  spacing,
  container,
  radius,
  duration,
  easing,
  motion,
  finish,
  shadow,
} from '.';

const flattenKeys = (value: Record<string, unknown>, prefix = ''): string[] => {
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

  it('terracotta brand와 verdigris positive semantic을 제공한다', () => {
    expect(lightColor.fg.brand).toBe(palette.clay[700]);
    expect(darkColor.fg.positive).toBe(palette.verdigris[300]);
    expect(darkColor.bg.canvas).toBe(palette.sand[900]);
  });

  it('bg.critical(솔리드)이 brand와 구분되는 별도 레드다', () => {
    expect(lightColor.bg.critical).toBe(palette.critical[500]);
    expect(darkColor.bg.critical).toBe(palette.critical[500]);
    expect(darkColor.bg.critical).not.toBe(darkColor.bg.brand);
  });

  it('배경 실루엣용 scenery 톤 3종을 제공한다', () => {
    expect(lightColor.scenery.far).toBe(palette.sand[300]);
    expect(lightColor.scenery.near).toBe(palette.clay[500]);
    expect(darkColor.scenery.far).toBe(palette.sand[800]);
    expect(darkColor.scenery.near).toBe(palette.clay[700]);
  });

  it('공기원근이 성립하도록 scenery 세 톤이 서로 다르다', () => {
    for (const theme of [lightColor, darkColor]) {
      const tones = new Set([
        theme.scenery.far,
        theme.scenery.mid,
        theme.scenery.near,
      ]);
      expect(tones.size).toBe(3);
    }
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

  it('페이지 h1용 headingXl과 40px 스케일을 제공한다', () => {
    expect(typography.fontSize[40]).toBe('2.5rem');
    expect(typography.text.headingXl).toMatchObject({
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize[40],
      lineHeight: typography.lineHeight.tight,
      fontWeight: typography.fontWeight.bold,
    });
  });

  it('dimension scale과 semantic spacing을 분리한다', () => {
    expect(dimension.x0_5).toBe('0.125rem');
    expect(dimension.x4).toBe('1rem');
    expect(spacing.globalGutter).toBe(dimension.x4);
    expect(spacing.cardPadding).toBe(dimension.x6);
  });

  it('container semantic 폭을 역할별로 제공한다', () => {
    expect(container.form).toBe('20rem');
    expect(container.dialog).toBe('32rem');
    expect(container.prose).toBe('48rem');
    expect(container.page).toBe('56rem');
    expect(container.wide).toBe('72rem');
  });

  it('radius와 motion semantic alias를 제공한다', () => {
    expect(radius.control).toBe(radius.r2);
    expect(radius.pill).toBe(radius.full);
    expect(motion.colorTransition.duration).toBe(duration.d3);
    expect(motion.controlFeedback.easing).toBe(easing.enter);
    expect(motion.themeReveal.duration).toBe('2000ms');
    expect(easing.spring).toBe('cubic-bezier(0.34, 1.4, 0.64, 1)');
    expect(motion.tactileLift.easing).toBe(easing.spring);
    expect(motion.controlSlide.easing).toBe(easing.springStrong);
  });

  it('aged-bronze 재질 효과 상수를 제공한다', () => {
    expect(finish.inset).toContain('inset');
    expect(shadow.raise).toContain('rgba');
    expect(shadow.press).toContain('inset');
  });
});

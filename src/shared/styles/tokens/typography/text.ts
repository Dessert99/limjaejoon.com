/** semantic text styles — 반복되는 UI 텍스트 조합을 고정한다 */
import { fontFamily, fontSize, fontWeight, lineHeight } from './scale';

/** semantic text style shape — CSS 텍스트 속성 조합을 고정한다 */
export interface TextStyle {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
}

/** semantic text style tokens — 컴포넌트가 조합 대신 의미를 참조한다 */
export const text = {
  body: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize[16],
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.regular,
  },
  bodyStrong: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize[16],
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.semibold,
  },
  caption: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize[12],
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.regular,
  },
  label: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize[14],
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.medium,
  },
  headingSm: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize[20],
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.bold,
  },
  headingMd: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize[24],
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.bold,
  },
  headingLg: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize[32],
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.bold,
  },
  headingXl: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize[40],
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.bold,
  },
  code: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize[14],
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.regular,
  },
} as const satisfies Record<string, TextStyle>;

/** 테마 시스템 타입 — theme.css 의 contract(vars)와 themes 데이터가 공유하는 모양 계약 */

/** 토큰 컨트랙트와 같은 모양의 값 — theme.css 의 vars 와 1:1 대응 */
export interface ThemeValues {
  color: {
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
    accent: string;
  };
  font: { body: string; mono: string };
  radius: { sm: string; md: string; lg: string };
}

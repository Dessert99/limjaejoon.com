/** Progress 트랙·막대 — 막대는 value/max 비율만큼 채움 */
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 트랙 — text 10% 틴트로 4테마 공통 은은한 배경 */
export const root = style({
  position: 'relative', // 내부 absolute 요소가 생기면 이 트랙을 배치 기준으로 삼게 한다.
  overflow: 'hidden', // Indicator가 translate로 밖에 밀린 부분을 잘라 실제 채움만 보인다.
  width: '100%', // 부모 폭을 따라 트랙을 만들고 Indicator의 100% 기준도 맞춘다.
  height: '0.5rem', // 트랙 두께를 정하고 Indicator의 height: 100% 기준이 된다.
  borderRadius: '9999px', // 트랙을 캡슐 형태로 만들고 overflow와 함께 막대 끝을 둥글게 보인다.
  background: `color-mix(in srgb, ${vars.color.text} 10%, transparent)`, // 채워지지 않은 트랙 영역의 바탕색이다.
});

/** 채움 막대 — 너비 100%를 두고 translateX로 비율만큼만 노출 */
export const indicator = style({
  width: '100%', // 막대 전체 폭을 트랙과 같게 해 translateX 퍼센트 기준을 맞춘다.
  height: '100%', // Root 높이를 그대로 채워 막대 두께를 트랙과 같게 한다.
  background: vars.color.accent, // 화면에 노출된 Indicator 영역을 진행 색으로 표시한다.
  transition: 'transform 200ms ease', // value 변화로 transform이 바뀔 때 막대 이동을 부드럽게 한다.
});

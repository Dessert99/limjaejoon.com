import { createThemeContract } from '@vanilla-extract/css';

// CONTRACT: 계절 색 팔레트의 "모양"만 정의(값 없음). 각 계절(themes/*.css.ts)이
// createTheme 으로 이 모양을 정확히 만족시킨다. 컴포넌트는 color.primary 등 역할만
// 참조하고, 조상에 걸린 계절 클래스가 실제 값을 바꾼다 — MD3 color-roles 간접참조의 핵심.
// 역할 이름은 Material Design 3 sys-color 네이밍을 따른다.
// 접두사 on* 은 "그 색 위에 올라가는 글자·아이콘 색"으로, 대비(가독성)를 보장한다.
export const color = createThemeContract({
  primary: null, // 가장 강조되는 브랜드 색 — 주요 버튼·핵심 액션
  onPrimary: null, // primary 배경 위 글자·아이콘
  primaryContainer: null, // primary의 약한 톤 — 덜 튀는 강조 영역 배경
  onPrimaryContainer: null, // primaryContainer 위 글자·아이콘
  secondary: null, // 보조 강조 색 — 중요도 낮은 액션
  onSecondary: null, // secondary 배경 위 글자·아이콘
  secondaryContainer: null, // secondary의 약한 톤 배경
  onSecondaryContainer: null, // secondaryContainer 위 글자·아이콘
  tertiary: null, // 세 번째 악센트 색 — 대비용 포인트
  onTertiary: null, // tertiary 배경 위 글자·아이콘
  tertiaryContainer: null, // tertiary의 약한 톤 배경
  onTertiaryContainer: null, // tertiaryContainer 위 글자·아이콘
  error: null, // 오류 상태 색(보통 빨강 계열)
  onError: null, // error 배경 위 글자·아이콘
  errorContainer: null, // error의 약한 톤 — 경고 영역 배경
  onErrorContainer: null, // errorContainer 위 글자·아이콘
  background: null, // 화면 전체의 최하단 바탕색
  onBackground: null, // background 위 기본 글자색
  surface: null, // 카드·시트 등 표면의 기본 바탕색
  onSurface: null, // surface 위 본문 글자색
  surfaceVariant: null, // surface의 변형 톤 — 영역을 살짝 구분
  onSurfaceVariant: null, // surfaceVariant 위 보조 글자·아이콘(덜 강조)
  surfaceDim: null, // 표면 톤 중 가장 어두운 단계
  surfaceBright: null, // 표면 톤 중 가장 밝은 단계
  surfaceContainerLowest: null, // 표면 계층 중 가장 낮은(배경에 가까운) 톤
  surfaceContainerLow: null, // 낮은 단계의 표면 컨테이너 톤
  surfaceContainer: null, // 표면 컨테이너 기본 톤
  surfaceContainerHigh: null, // 높은 단계의 표면 컨테이너 톤
  surfaceContainerHighest: null, // 가장 떠 있는(높은) 표면 컨테이너 톤
  outline: null, // 경계선·구분선(테두리)
  outlineVariant: null, // 약한 경계선·디바이더
  inverseSurface: null, // 반전 표면 — 스낵바 등 대비 영역 배경
  inverseOnSurface: null, // inverseSurface 위 글자·아이콘
  inversePrimary: null, // 반전 영역에서 쓰는 primary
  shadow: null, // 그림자 색(보통 검정)
  scrim: null, // 모달·드로어 뒤를 어둡게 덮는 막
  surfaceTint: null, // elevation에 따라 표면에 입히는 primary 틴트
});

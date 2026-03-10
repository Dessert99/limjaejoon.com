import type {
  CssGroupSlug,
  CssPropertyCard,
  CssPropertyModule,
} from '@/features/handbook/css/common/types';
import { animationPropertyModule } from '@/features/handbook/css/properties/animation/module';
import { backgroundPropertyModule } from '@/features/handbook/css/properties/background/module';
import { borderPropertyModule } from '@/features/handbook/css/properties/border/module';
import { clipPathPropertyModule } from '@/features/handbook/css/properties/clip-path/module';
import { colorPropertyModule } from '@/features/handbook/css/properties/color/module';
import { displayPropertyModule } from '@/features/handbook/css/properties/display/module';
import { filterPropertyModule } from '@/features/handbook/css/properties/filter/module';
import { flexPropertyModule } from '@/features/handbook/css/properties/flex/module';
import { fontPropertyModule } from '@/features/handbook/css/properties/font/module';
import { heightPropertyModule } from '@/features/handbook/css/properties/height/module';
import { lineHeightPropertyModule } from '@/features/handbook/css/properties/line-height/module';
import { marginPropertyModule } from '@/features/handbook/css/properties/margin/module';
import { opacityPropertyModule } from '@/features/handbook/css/properties/opacity/module';
import { overflowPropertyModule } from '@/features/handbook/css/properties/overflow/module';
import { paddingPropertyModule } from '@/features/handbook/css/properties/padding/module';
import { positionPropertyModule } from '@/features/handbook/css/properties/position/module';
import { textAlignPropertyModule } from '@/features/handbook/css/properties/text-align/module';
import { transformPropertyModule } from '@/features/handbook/css/properties/transform/module';
import { transitionPropertyModule } from '@/features/handbook/css/properties/transition/module';
import { unitEmPropertyModule } from '@/features/handbook/css/properties/unit-em/module';
import { unitPercentPropertyModule } from '@/features/handbook/css/properties/unit-percent/module';
import { unitPxPropertyModule } from '@/features/handbook/css/properties/unit-px/module';
import { unitRemPropertyModule } from '@/features/handbook/css/properties/unit-rem/module';
import { widthPropertyModule } from '@/features/handbook/css/properties/width/module';
import { zIndexPropertyModule } from '@/features/handbook/css/properties/z-index/module';
import { cssGroups } from '@/features/handbook/css/catalog/groupMeta';

// CSS 속성 핸드북에서 노출할 전체 모듈 목록입니다.
export const cssPropertyModules: CssPropertyModule[] = [
  widthPropertyModule,
  heightPropertyModule,
  marginPropertyModule,
  paddingPropertyModule,
  displayPropertyModule,
  flexPropertyModule,
  positionPropertyModule,
  overflowPropertyModule,
  zIndexPropertyModule,
  backgroundPropertyModule,
  borderPropertyModule,
  opacityPropertyModule,
  filterPropertyModule,
  clipPathPropertyModule,
  colorPropertyModule,
  fontPropertyModule,
  textAlignPropertyModule,
  lineHeightPropertyModule,
  unitPxPropertyModule,
  unitPercentPropertyModule,
  unitEmPropertyModule,
  unitRemPropertyModule,
  transformPropertyModule,
  transitionPropertyModule,
  animationPropertyModule,
];

// 상세 라우트 생성에 사용하는 slug 목록입니다.
export const cssPropertySlugs = cssPropertyModules.map((property) => property.slug);

const cssPropertyModuleMap = new Map(
  cssPropertyModules.map((property) => [property.slug, property] as const)
);

// slug로 속성 모듈을 조회합니다.
export const getCssPropertyModuleBySlug = (
  slug: string
): CssPropertyModule | undefined => {
  return cssPropertyModuleMap.get(slug);
};

// 목록 카드에서 노출할 최소 데이터만 추립니다.
export const cssPropertyCards: CssPropertyCard[] = cssPropertyModules.map((property) => ({
  slug: property.slug,
  group: property.group,
  title: property.title,
  intent: property.intent,
}));

// 대분류 기준으로 카드 목록을 미리 그룹화합니다.
export const groupedCssPropertyCards = cssGroups.map((group) => ({
  group,
  cards: cssPropertyCards.filter((card) => card.group === group.slug),
}));

// 대분류 slug 별 모듈 조회 유틸입니다.
export const getCssPropertyModulesByGroup = (
  group: CssGroupSlug
): CssPropertyModule[] => {
  return cssPropertyModules.filter((property) => property.group === group);
};

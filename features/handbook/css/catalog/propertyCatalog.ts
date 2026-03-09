import type {
  CssGroupSlug,
  CssPropertyCard,
  CssPropertyModule,
} from '@/features/handbook/css/common/types';
import { alignItemsPropertyModule } from '@/features/handbook/css/properties/align-items/module';
import { backgroundPropertyModule } from '@/features/handbook/css/properties/background/module';
import { borderPropertyModule } from '@/features/handbook/css/properties/border/module';
import { flexPropertyModule } from '@/features/handbook/css/properties/flex/module';
import { heightPropertyModule } from '@/features/handbook/css/properties/height/module';
import { justifyContentPropertyModule } from '@/features/handbook/css/properties/justify-content/module';
import { marginPropertyModule } from '@/features/handbook/css/properties/margin/module';
import { paddingPropertyModule } from '@/features/handbook/css/properties/padding/module';
import { textPropertyModule } from '@/features/handbook/css/properties/text/module';
import { widthPropertyModule } from '@/features/handbook/css/properties/width/module';
import { cssGroups } from '@/features/handbook/css/catalog/groupMeta';

// CSS 속성 핸드북에서 노출할 전체 모듈 목록입니다.
export const cssPropertyModules: CssPropertyModule[] = [
  flexPropertyModule,
  justifyContentPropertyModule,
  alignItemsPropertyModule,
  widthPropertyModule,
  heightPropertyModule,
  marginPropertyModule,
  paddingPropertyModule,
  backgroundPropertyModule,
  borderPropertyModule,
  textPropertyModule,
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

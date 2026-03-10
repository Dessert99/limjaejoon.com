// 핸드북 라우트 하위 전역 스타일을 로드합니다.
import '@/features/handbook/css/common/styles/snippetPlayground.css';
// CSS 카테고리 카드 전용 스타일을 로드합니다.
import '@/features/handbook/css/catalog/styles/propertyCatalog.css';
// animation 핸드북 미리보기 keyframes 스타일을 로드합니다.
import '@/features/handbook/css/properties/animation/styles/animationPreview.css';
// 핸드북 플립 카드 전용 스타일을 로드합니다.
import '@/features/handbook/shared/styles/flip.css';

interface HandbookLayoutProps {
  // 핸드북 하위 페이지 콘텐츠를 받습니다.
  children: React.ReactNode;
}

// 핸드북 세그먼트 전용 레이아웃입니다.
export default function HandbookLayout({ children }: HandbookLayoutProps) {
  // 핸드북 페이지 콘텐츠를 그대로 렌더합니다.
  return children;
}

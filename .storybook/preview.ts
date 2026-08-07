/** Storybook preview — 앱과 같은 global.css 한 파일을 쓴다(SB 전용 스타일을 만들지 않는다) */
import type { Decorator, Preview } from '@storybook/nextjs-vite';
import { pretendard } from '../src/shared/styles';
import '../src/shared/styles/global.css';

// 폰트 변수는 <html> 에 있어야 한다 — :root 에서 선언된 --font-body 가 거기서 해석되기 때문
document.documentElement.classList.add(pretendard.variable);

/** 모션 감쇠 토글 — 무한 애니메이션을 스토리에서 멈추는 수단을 겸한다 */
const withMotionPreference: Decorator = (Story, context) => {
  document.documentElement.dataset.motion = String(context.globals.motion);
  return Story();
};

/** 서피스 반전 토글 — 테마가 아니라 섹션 반전이라, 앱처럼 light 만 걸었다 뗀다(다크는 :root 기본값이다) */
const withSurface: Decorator = (Story, context) => {
  const root = document.documentElement;

  if (context.globals.surface === 'light') {
    root.dataset.surface = 'light';
  } else {
    delete root.dataset.surface;
  }

  return Story();
};

const preview: Preview = {
  parameters: {
    // md·lg 는 tokens.css 의 --breakpoint-*, 나머지는 설계 성공 기준의 실기기 폭이다
    viewport: {
      options: {
        mobile: {
          name: 'Mobile 375',
          styles: { width: '375px', height: '812px' },
        },
        mobileLarge: {
          name: 'Mobile 430',
          styles: { width: '430px', height: '932px' },
        },
        md: { name: 'md 768', styles: { width: '768px', height: '1024px' } },
        lg: { name: 'lg 1024', styles: { width: '1024px', height: '768px' } },
        desktop: {
          name: 'Desktop 1440',
          styles: { width: '1440px', height: '900px' },
        },
      },
    },
    // 배경은 data-surface 토글이 소유한다 — 두 곳에서 바꾸면 대비 검증이 무의미해진다
    backgrounds: { disable: true },
    a11y: { test: 'error' },
  },
  initialGlobals: {
    motion: 'full',
    surface: 'dark',
  },
  globalTypes: {
    surface: {
      description: '서피스 반전',
      toolbar: {
        title: 'Surface',
        icon: 'contrast',
        items: [
          { value: 'dark', title: '기본 (dark)' },
          { value: 'light', title: 'data-surface=light' },
        ],
        dynamicTitle: true,
      },
    },
    motion: {
      description: '모션 감쇠',
      toolbar: {
        title: 'Motion',
        icon: 'play',
        items: [
          { value: 'full', title: 'Full motion' },
          { value: 'reduced', title: 'Reduced motion' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withMotionPreference, withSurface],
  tags: ['autodocs'],
};

export default preview;

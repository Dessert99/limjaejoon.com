/** SiteNavigation 스토리 — 모바일 메뉴의 포커스 가둠·Escape 는 브라우저 몫이라 여기서만 검증된다 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SiteNavigation } from './SiteNavigation';

const meta = {
  title: 'Widgets/SiteNavigation',
  component: SiteNavigation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '데스크톱은 목록, 모바일은 네이티브 `<dialog>` 다. `showModal()` 이라야 Escape 닫기와 포커스 가둠을 브라우저가 대신 한다. **jsdom 에는 `showModal` 이 없어 단위 테스트는 열고 닫는 배선까지만 본다** — 포커스가 메뉴 안에 갇히는지, Escape 로 닫히는지는 여기서 키보드로 직접 확인한다.',
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <div className='min-h-svh bg-background text-foreground'>
          <Story />
          {/* fixed 라 문서 흐름을 차지하지 않는다 — 아래 내용이 밀리지 않는 게 정상이다 */}
          <div className='px-gutter pt-32'>
            <p className='text-statement'>내비게이션 아래로 흐르는 본문</p>
            <p className='mt-4 text-body text-muted'>
              스크롤해도 상단에 계속 붙어 있어야 한다.
            </p>
          </div>
          <div className='h-svh' />
        </div>
      );
    },
  ],
} satisfies Meta<typeof SiteNavigation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
};

export const Tablet: Story = {
  globals: { viewport: { value: 'md' } },
};

/** 여기서 "메뉴 열기" 를 누르고 Tab 을 돌려 본다 — 포커스가 메뉴 밖으로 새면 안 된다 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile' } },
};

/** 밝은 섹션 위에 겹칠 때 — 내비게이션은 자기가 어디 위에 있는지 모른다 */
export const OnLightSurface: Story = {
  globals: { theme: 'dark' },
  decorators: [
    (Story) => {
      return (
        <div
          className='min-h-svh bg-surface text-foreground'
          data-surface='light'>
          <Story />
          <div className='px-gutter pt-32'>
            <p className='text-statement'>밝은 섹션 위</p>
          </div>
        </div>
      );
    },
  ],
};

export const ReducedMotion: Story = {
  globals: { motion: 'reduced' },
};

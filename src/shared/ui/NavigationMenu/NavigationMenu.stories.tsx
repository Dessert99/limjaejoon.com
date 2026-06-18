/** NavigationMenu 상태 문서 — 사이트 상단 내비, 트리거에 hover/클릭하면 링크 패널이 열린다 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NavigationMenu } from './NavigationMenu';

const meta = { title: 'shared/ui/NavigationMenu' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Link
              href='/'
              active>
              홈
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>글</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link href='/blog'>블로그</NavigationMenu.Link>
              <NavigationMenu.Link href='/blog/tags'>태그</NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href='/about'>소개</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    );
  },
};

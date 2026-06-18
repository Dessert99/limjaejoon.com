/** ScrollArea 상태 문서 — 높이를 제한한 영역에 긴 내용을 넣으면 커스텀 스크롤바가 뜬다 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ScrollArea } from './ScrollArea';

const meta = { title: 'shared/ui/ScrollArea' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <ScrollArea style={{ height: 160, width: 220 }}>
        <div style={{ padding: 12 }}>
          {Array.from({ length: 20 }).map((_, index) => {
            return (
              <p
                key={index}
                style={{ margin: '0 0 8px' }}>
                스크롤 항목 {index + 1}
              </p>
            );
          })}
        </div>
      </ScrollArea>
    );
  },
};

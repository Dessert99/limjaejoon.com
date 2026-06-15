/** Button 상태 문서 — variant 매트릭스, 크기, 아이콘 합성, asChild 링크, 비활성 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './Button';

/** 데모용 인라인 아이콘 — 별도 prop 없이 children에 넣으면 base의 svg 규칙이 크기를 잡는다 */
function PlusIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      aria-hidden>
      <path d='M12 5v14M5 12h14' />
    </svg>
  );
}

const meta = {
  title: 'shared/ui/Button',
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: '버튼' } };

export const Variants: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button variant='solid'>solid</Button>
        <Button variant='outline'>outline</Button>
        <Button variant='ghost'>ghost</Button>
        <Button variant='link'>link</Button>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button size='sm'>sm</Button>
        <Button size='md'>md</Button>
        <Button size='lg'>lg</Button>
      </div>
    );
  },
};

export const WithIcon: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button>
          <PlusIcon />
          왼쪽 아이콘
        </Button>
        <Button variant='outline'>
          오른쪽 아이콘
          <PlusIcon />
        </Button>
      </div>
    );
  },
};

export const AsLink: Story = {
  render: () => {
    return (
      <Button
        variant='link'
        asChild>
        <a href='#'>링크 버튼</a>
      </Button>
    );
  },
};

export const Disabled: Story = { args: { children: '비활성', disabled: true } };

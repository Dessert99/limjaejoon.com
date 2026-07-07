/** Button 상태 문서 — variant, size, layout, icon slot, loading, asChild 매트릭스 */
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
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
        <Button variant='brandSolid'>brandSolid</Button>
        <Button variant='neutralSolid'>neutralSolid</Button>
        <Button variant='neutralWeak'>neutralWeak</Button>
        <Button variant='criticalSolid'>criticalSolid</Button>
        <Button variant='brandOutline'>brandOutline</Button>
        <Button variant='neutralOutline'>neutralOutline</Button>
        <Button variant='ghost'>ghost</Button>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button size='xsmall'>xsmall</Button>
        <Button size='small'>small</Button>
        <Button size='medium'>medium</Button>
        <Button size='large'>large</Button>
      </div>
    );
  },
};

export const WithIconSlots: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button>
          <Button.PrefixIcon>
            <PlusIcon />
          </Button.PrefixIcon>
          왼쪽 아이콘
        </Button>
        <Button variant='neutralOutline'>
          오른쪽 아이콘
          <Button.SuffixIcon>
            <PlusIcon />
          </Button.SuffixIcon>
        </Button>
      </div>
    );
  },
};

export const IconOnly: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button
          layout='iconOnly'
          size='small'
          aria-label='추가'>
          <Button.Icon>
            <PlusIcon />
          </Button.Icon>
        </Button>
        <Button
          layout='iconOnly'
          size='medium'
          variant='neutralOutline'
          aria-label='추가'>
          <Button.Icon>
            <PlusIcon />
          </Button.Icon>
        </Button>
        <Button
          layout='iconOnly'
          size='large'
          variant='ghost'
          aria-label='추가'>
          <Button.Icon>
            <PlusIcon />
          </Button.Icon>
        </Button>
      </div>
    );
  },
};

export const Loading: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button loading>저장 중</Button>
        <Button
          loading
          disabled
          variant='neutralOutline'>
          비활성 로딩
        </Button>
      </div>
    );
  },
};

export const AsLink: Story = {
  render: () => {
    return (
      <Button
        variant='ghost'
        asChild>
        <a href='#'>링크 버튼</a>
      </Button>
    );
  },
};

export const Disabled: Story = { args: { children: '비활성', disabled: true } };

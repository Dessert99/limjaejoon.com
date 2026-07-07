/** Slider 상태 문서 — 기본, step, range, 비활성 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Slider } from './Slider';

const meta = { title: 'shared/ui/Slider' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/** SliderFrame — width: 100% 트랙을 Storybook 캔버스에서 확인할 수 있게 제한한다 */
function SliderFrame({ children }: { children: React.ReactNode }) {
  return <div style={{ width: '20rem', maxWidth: '100%' }}>{children}</div>;
}

/** SliderParts — Radix compound anatomy를 매번 같은 순서로 조합한다 */
function SliderParts({
  labels = ['값'],
}: {
  labels?: readonly [string] | readonly [string, string];
}) {
  return (
    <>
      <Slider.Track>
        <Slider.Range />
      </Slider.Track>
      {labels.map((label) => {
        return (
          <Slider.Thumb
            key={label}
            aria-label={label}
          />
        );
      })}
    </>
  );
}

export const Default: Story = {
  render: () => {
    return (
      <SliderFrame>
        <Slider.Root
          defaultValue={[50]}
          max={100}>
          <SliderParts />
        </Slider.Root>
      </SliderFrame>
    );
  },
};

export const Step: Story = {
  render: () => {
    return (
      <SliderFrame>
        <Slider.Root
          defaultValue={[40]}
          max={100}
          step={10}>
          <SliderParts labels={['단계 값']} />
        </Slider.Root>
      </SliderFrame>
    );
  },
};

export const Range: Story = {
  render: () => {
    return (
      <SliderFrame>
        <Slider.Root
          defaultValue={[25, 75]}
          max={100}
          step={5}>
          <SliderParts labels={['최소값', '최대값']} />
        </Slider.Root>
      </SliderFrame>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <SliderFrame>
        <Slider.Root
          defaultValue={[60]}
          max={100}
          disabled>
          <SliderParts />
        </Slider.Root>
      </SliderFrame>
    );
  },
};

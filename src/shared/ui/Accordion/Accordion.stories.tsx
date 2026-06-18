/** Accordion 상태 문서 — single(collapsible FAQ), multiple(동시 열림) */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Accordion } from './Accordion';

const meta = { title: 'shared/ui/Accordion' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: () => {
    return (
      <Accordion.Root
        type='single'
        collapsible
        defaultValue='shipping'>
        <Accordion.Item value='shipping'>
          <Accordion.Header>
            <Accordion.Trigger>배송은 얼마나 걸리나요?</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>보통 2~3 영업일 내 도착합니다.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value='return'>
          <Accordion.Header>
            <Accordion.Trigger>반품이 가능한가요?</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            수령 후 14일 이내 반품할 수 있습니다.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    );
  },
};

export const Multiple: Story = {
  render: () => {
    return (
      <Accordion.Root
        type='multiple'
        defaultValue={['a']}>
        <Accordion.Item value='a'>
          <Accordion.Header>
            <Accordion.Trigger>섹션 A</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            여러 항목을 동시에 펼칠 수 있습니다.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value='b'>
          <Accordion.Header>
            <Accordion.Trigger>섹션 B</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>A를 닫지 않아도 B가 열립니다.</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    );
  },
};

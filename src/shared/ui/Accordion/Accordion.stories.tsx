/** Accordion 상태 문서 — 배열 상태 API, 확장 slot, measured height motion */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Accordion } from './Accordion';

const meta = { title: 'shared/ui/Accordion' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/** Controlled 예시 — 호출처가 values 배열로 제품 정책을 소유한다 */
function ControlledAccordionStory() {
  const [values, setValues] = useState(['overview']);

  return (
    <Accordion.Root
      values={values}
      onValuesChange={(nextValues) => {
        if (nextValues.length === 0) {
          return;
        }
        setValues(nextValues);
      }}>
      <Accordion.Item value='overview'>
        <Accordion.Header>
          <Accordion.Trigger>
            <Accordion.Body>
              <Accordion.Title>항상 하나 열림</Accordion.Title>
              <Accordion.Description>
                호출처가 빈 배열 변경을 거부한다
              </Accordion.Description>
            </Accordion.Body>
            <Accordion.Indicator />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Accordion.ContentInner>
            controlled values로 제품 정책을 얹을 수 있습니다.
          </Accordion.ContentInner>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

export const Single: Story = {
  render: () => {
    return (
      <Accordion.Root
        defaultValues={['shipping']}
        collapsible>
        <Accordion.Item value='shipping'>
          <Accordion.Header>
            <Accordion.Trigger>
              <Accordion.Prefix>01</Accordion.Prefix>
              <Accordion.Body>
                <Accordion.Title>배송은 얼마나 걸리나요?</Accordion.Title>
                <Accordion.Description>
                  주문 이후 평균 배송 기간
                </Accordion.Description>
              </Accordion.Body>
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <Accordion.ContentInner>
              보통 2~3 영업일 내 도착합니다.
            </Accordion.ContentInner>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value='return'>
          <Accordion.Header>
            <Accordion.Trigger>
              <Accordion.Prefix>02</Accordion.Prefix>
              <Accordion.Body>
                <Accordion.Title>반품이 가능한가요?</Accordion.Title>
                <Accordion.Description>
                  수령 이후 반품 가능 기간
                </Accordion.Description>
              </Accordion.Body>
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <Accordion.ContentInner>
              수령 후 14일 이내 반품할 수 있습니다.
            </Accordion.ContentInner>
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
        multiple
        defaultValues={['a']}>
        <Accordion.Item value='a'>
          <Accordion.Header>
            <Accordion.Trigger>
              <Accordion.Body>
                <Accordion.Title>섹션 A</Accordion.Title>
                <Accordion.Description>
                  첫 번째 내용을 유지
                </Accordion.Description>
              </Accordion.Body>
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <Accordion.ContentInner>
              여러 항목을 동시에 펼칠 수 있습니다.
            </Accordion.ContentInner>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value='b'>
          <Accordion.Header>
            <Accordion.Trigger>
              <Accordion.Body>
                <Accordion.Title>섹션 B</Accordion.Title>
                <Accordion.Description>
                  A를 닫지 않고 열기
                </Accordion.Description>
              </Accordion.Body>
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <Accordion.ContentInner>
              A를 닫지 않아도 B가 열립니다.
            </Accordion.ContentInner>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    return <ControlledAccordionStory />;
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <Accordion.Root defaultValues={['enabled']}>
        <Accordion.Item value='enabled'>
          <Accordion.Header>
            <Accordion.Trigger>
              <Accordion.Body>
                <Accordion.Title>활성 항목</Accordion.Title>
                <Accordion.Description>열고 닫을 수 있음</Accordion.Description>
              </Accordion.Body>
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <Accordion.ContentInner>
              사용 가능한 항목입니다.
            </Accordion.ContentInner>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item
          value='disabled'
          disabled>
          <Accordion.Header>
            <Accordion.Trigger>
              <Accordion.Body>
                <Accordion.Title>비활성 항목</Accordion.Title>
                <Accordion.Description>
                  상호작용할 수 없음
                </Accordion.Description>
              </Accordion.Body>
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <Accordion.ContentInner>
              비활성 항목의 본문입니다.
            </Accordion.ContentInner>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    );
  },
};

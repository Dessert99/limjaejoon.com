import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Accordion } from './Accordion';

describe('Accordion', () => {
  it('defaultValues와 collapsible을 single 상태로 연결한다', async () => {
    const user = userEvent.setup();
    const onValuesChange = vi.fn();

    render(
      <Accordion.Root
        defaultValues={['shipping']}
        collapsible
        onValuesChange={onValuesChange}>
        <Accordion.Item value='shipping'>
          <Accordion.Header>
            <Accordion.Trigger>배송</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>배송 안내</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    );

    const trigger = screen.getByRole('button', { name: '배송' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await user.click(trigger);

    expect(onValuesChange).toHaveBeenCalledWith([]);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('multiple 상태에서도 onValuesChange를 배열 계약으로 유지한다', async () => {
    const user = userEvent.setup();
    const onValuesChange = vi.fn();

    render(
      <Accordion.Root
        multiple
        defaultValues={['shipping']}
        onValuesChange={onValuesChange}>
        <Accordion.Item value='shipping'>
          <Accordion.Header>
            <Accordion.Trigger>배송</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>배송 안내</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value='return'>
          <Accordion.Header>
            <Accordion.Trigger>반품</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>반품 안내</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    );

    await user.click(screen.getByRole('button', { name: '반품' }));

    expect(onValuesChange).toHaveBeenCalledWith(['shipping', 'return']);
  });

  it('확장 anatomy slot에 외부 className을 병합한다', () => {
    const { container } = render(
      <Accordion.Root defaultValues={['motion']}>
        <Accordion.Item value='motion'>
          <Accordion.Header>
            <Accordion.Trigger>
              <Accordion.Prefix className='prefix-slot'>아이콘</Accordion.Prefix>
              <Accordion.Body className='body-slot'>
                <Accordion.Title className='title-slot'>모션</Accordion.Title>
                <Accordion.Description className='description-slot'>
                  높이와 아이콘 회전
                </Accordion.Description>
              </Accordion.Body>
              <Accordion.Indicator className='indicator-slot'>
                ⌄
              </Accordion.Indicator>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <Accordion.ContentInner className='content-inner-slot'>
              부드럽게 열린다
            </Accordion.ContentInner>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    );

    expect(container.querySelector('.prefix-slot')).toBeInTheDocument();
    expect(container.querySelector('.body-slot')).toBeInTheDocument();
    expect(screen.getByText('모션')).toHaveClass('title-slot');
    expect(screen.getByText('높이와 아이콘 회전')).toHaveClass(
      'description-slot'
    );
    expect(container.querySelector('.indicator-slot')).toBeInTheDocument();
    expect(screen.getByText('부드럽게 열린다')).toHaveClass(
      'content-inner-slot'
    );
  });
});

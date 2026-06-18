import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Accordion } from './Accordion';

// 두 항목짜리 single+collapsible 아코디언 — 동작 검증용 공통 마크업
function renderAccordion(onValueChange?: (value: string) => void) {
  return render(
    <Accordion.Root
      type='single'
      collapsible
      onValueChange={onValueChange}>
      <Accordion.Item value='a'>
        <Accordion.Header>
          <Accordion.Trigger>섹션 A</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>내용 A</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value='b'>
        <Accordion.Header>
          <Accordion.Trigger>섹션 B</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>내용 B</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

describe('Accordion', () => {
  it('트리거를 클릭하면 해당 패널이 열린다', async () => {
    renderAccordion();

    const trigger = screen.getByRole('button', { name: '섹션 A' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('내용 A')).not.toBeInTheDocument();

    await userEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region')).toHaveTextContent('내용 A');
  });

  it('single 타입은 새 패널을 열면 이전 패널이 닫힌다', async () => {
    renderAccordion();

    await userEvent.click(screen.getByRole('button', { name: '섹션 A' }));
    expect(screen.getByText('내용 A')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '섹션 B' }));
    expect(screen.queryByText('내용 A')).not.toBeInTheDocument();
    expect(screen.getByText('내용 B')).toBeInTheDocument();
  });

  it('열린 항목의 값을 onValueChange로 알린다', async () => {
    const onValueChange = vi.fn();
    renderAccordion(onValueChange);

    await userEvent.click(screen.getByRole('button', { name: '섹션 B' }));

    expect(onValueChange).toHaveBeenCalledWith('b');
  });
});

/** 코드 패널 — 조작값을 실제 transition 선언으로 보여주고 클립보드로 복사한다 */
import { Button, Toast } from '@/shared/ui';
import { useState } from 'react';
import type { TransitionConfig } from '../../model/presets';
import { toCssValue } from '../../model/toCssValue';
import * as s from './CodePanel.css';

type CodePanelProps = {
  config: TransitionConfig;
};

/** 실시간 CSS 선언 표시 + 복사 — 복사 성공은 Toast로 알린다 */
export function CodePanel({ config }: CodePanelProps) {
  const [copied, setCopied] = useState(false);
  const declaration = `transition: ${toCssValue(config)};`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(declaration);
    setCopied(true); // duration이 지나면 Radix가 onOpenChange(false)로 닫는다
  };

  return (
    <Toast.Provider duration={2000}>
      <section
        aria-label='CSS 코드'
        className={s.panel}>
        <pre className={s.code}>
          <code>{declaration}</code>
        </pre>
        <Button onClick={handleCopy}>복사</Button>
      </section>
      <Toast.Root
        open={copied}
        onOpenChange={setCopied}>
        <Toast.Title>복사됐어요</Toast.Title>
      </Toast.Root>
      <Toast.Viewport />
    </Toast.Provider>
  );
}

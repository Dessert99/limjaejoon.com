/** 코드 패널 — 키프레임 원문과 animation 선언을 함께 보여주고 클립보드로 복사한다 */
import { Button, Toast } from '@/shared/ui';
import { useState } from 'react';
import { KEYFRAMES_PRESETS, type AnimationConfig } from '../model/presets';
import { toCssValue } from '../model/toCssValue';
import * as s from './CodePanel.css';

type CodePanelProps = {
  config: AnimationConfig;
};

/** 실시간 CSS 표시 + 복사 — @keyframes와 축약형 선언은 한 몸이라 함께 다룬다 */
export function CodePanel({ config }: CodePanelProps) {
  const [copied, setCopied] = useState(false);
  const keyframesText = KEYFRAMES_PRESETS.find((preset) => {
    return preset.id === config.preset;
  })!.cssText;
  const declaration = `${keyframesText}\n\n.box {\n  animation: ${toCssValue(config)};\n}`;

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

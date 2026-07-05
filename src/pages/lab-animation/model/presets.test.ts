import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG, KEYFRAMES_PRESETS } from './presets';

describe('KEYFRAMES_PRESETS', () => {
  it('기본 config의 preset이 프리셋 목록에 존재한다', () => {
    const ids = KEYFRAMES_PRESETS.map((preset) => {
      return preset.id;
    });
    expect(ids).toContain(DEFAULT_CONFIG.preset);
  });

  it('각 프리셋의 cssText가 자기 id의 @keyframes 선언으로 시작한다', () => {
    for (const preset of KEYFRAMES_PRESETS) {
      expect(preset.cssText.startsWith(`@keyframes ${preset.id} {`)).toBe(
        true
      );
    }
  });
});

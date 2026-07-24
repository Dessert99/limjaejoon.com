/** themeBootScript 동작 테스트 — 인라인 문자열 스크립트를 실제 실행해 :root 갱신을 검증 */
import { afterEach, describe, expect, it } from 'vitest';
import { THEME_STORAGE_KEY, themeBootScript } from './themeScript';

// 인라인 <script>와 같은 조건으로 실행 — 모듈 스코프가 아닌 전역에서 돈다
const runBootScript = () => {
  return new Function(themeBootScript)();
};

describe('themeBootScript', () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme;
    localStorage.clear();
  });

  it('저장된 테마가 dark면 :root에 data-theme="dark"를 심는다', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    runBootScript();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('저장된 테마가 없으면 data-theme을 건드리지 않는다', () => {
    runBootScript();
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });

  it('저장된 값이 light/dark가 아니면 무시한다', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'sunset');
    runBootScript();
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });
});

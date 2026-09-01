import { CssLab } from '../components/CssLab/CssLab';
import type { Components } from 'react-markdown';

/** 본문에 쓴 커스텀 태그를 컴포넌트로 바꾼다. JSX 내장 태그가 아니라 Components 타입이 모른다. */
export const MARKDOWN_COMPONENTS = {
  'css-lab': CssLab,
} as Components;

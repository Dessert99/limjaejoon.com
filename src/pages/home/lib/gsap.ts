'use client';

// 'use client' 는 사실 진술이다 — 플러그인 등록이 document 를 만지므로 서버 그래프에 딸려 들어가면 안 된다.
/** GSAP 진입점 — 등록을 한 곳에 모은다. 컴포넌트는 gsap 패키지를 직접 가져오지 않는다 */
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// useGSAP 도 등록 대상이다 — 등록해야 gsap.context 정리가 훅 생명주기에 걸린다
// MorphSVGPlugin 은 내보내지 않는다 — 소비자는 트윈의 morphSVG 속성으로만 쓰고 플러그인을 직접 만지지 않는다
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, MorphSVGPlugin, useGSAP);

export { gsap, ScrollSmoother, ScrollTrigger, useGSAP };

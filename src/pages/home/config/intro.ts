/** 인트로 문구 — 이름·직무는 SITE 가 유일한 출처라 여기서는 문장 모양만 정한다 */
import { SITE } from '@/shared/config';

/** 사이트에 처음 들어온 사람에게 타이핑으로 찍히는 한 문장 */
export const INTRO_GREETING = `안녕하세요. ${SITE.role} ${SITE.name}입니다.`;

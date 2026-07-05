/** 첫 페인트 전 저장된 테마를 :root에 심는 인라인 부트 스크립트 — 다크 모드 FOUC 방지 */

/** localStorage에 테마 선택을 저장하는 키 */
export const THEME_STORAGE_KEY = 'theme';

// 인라인 <script>로 들어가므로 문자열 유지 — localStorage 접근 불가 환경(시크릿 등)은 try로 무시
export const themeBootScript = `try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

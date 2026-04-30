// open redirect 방어 헬퍼 — returnTo 파라미터를 검증하고 안전한 경로만 반환한다 (ADR 0005)

// 루프 방지: 이 prefix로 시작하는 경로는 returnTo로 사용 불가 (로그인 → 로그인 루프 차단)
const DISALLOWED_PREFIXES = ['/login', '/signup'];

// 안전한 내부 경로만 허용하는 정규식 (ADR 0005 규칙 5)
// - `/`로 시작해야 함
// - `//`로 시작 금지 (protocol-relative URL 차단)
// - 허용 문자: 영문·숫자·하이픈·점·슬래시·물음표·등호·앰퍼샌드·퍼센트
const SAFE_PATH_RE = /^\/(?!\/)([\w\-./?=&%]*)$/;

/**
 * returnTo 값을 검증해 안전한 내부 경로를 반환한다.
 * 검증 실패 시 '/'를 반환한다.
 */
export const safeReturnTo = (input: string | null | undefined): string => {
  // 입력이 없으면 홈으로
  if (!input) {
    return '/';
  }

  // 백슬래시 포함 금지 — Windows 경로 트릭 방지 (ADR 0005 규칙 3)
  if (input.includes('\\')) {
    return '/';
  }

  // 정규식으로 안전한 path-only 형식 검증
  if (!SAFE_PATH_RE.test(input)) {
    return '/';
  }

  // 루프 유발 prefix 차단
  for (const prefix of DISALLOWED_PREFIXES) {
    if (
      input === prefix ||
      input.startsWith(`${prefix}/`) ||
      input.startsWith(`${prefix}?`)
    ) {
      return '/';
    }
  }

  return input;
};

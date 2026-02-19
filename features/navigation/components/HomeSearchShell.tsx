interface HomeSearchShellProps {
  // 헤더 축소 상태 여부입니다.
  compact: boolean;
  // 검색어 값을 상위에서 제어하기 위해 사용합니다.
  value: string;
  // 입력 변경 이벤트를 상위로 전달합니다.
  onChange: (nextValue: string) => void;
  // 헤더 그리드 배치를 위해 외부 className을 주입받습니다.
  className?: string;
}

// 블로그 헤더에서 사용하는 1차 검색 UI 컴포넌트입니다. (검색 로직은 추후 연결)
export function HomeSearchShell({
  compact,
  value,
  onChange,
  className,
}: HomeSearchShellProps) {
  return (
    <section
      aria-label='블로그 검색'
      className={[
        // 검색 박스 공통 스타일입니다.
        'mx-auto flex w-full items-center rounded-md border border-(--line-strong) bg-(--bg-elevated)',
        // 축소 상태에서는 nav 높이에 맞게 입력 박스를 낮춥니다.
        compact
          ? 'max-w-(--search-compact-max) px-2 py-1.5'
          : 'max-w-(--search-expanded-max) px-3 py-2',
        // 부모에서 지정한 그리드 위치 클래스를 병합합니다.
        className ?? '',
      ].join(' ')}>
      {/* 접근성을 위해 시각적으로 숨겨진 라벨을 제공합니다. */}
      <label
        htmlFor='home-search-input'
        className='sr-only'>
        블로그 검색
      </label>

      <input
        id='home-search-input'
        type='search'
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder='검색어를 입력하세요'
        aria-label='블로그 검색'
        className={[
          // 검색 input 공통 스타일입니다.
          'w-full border-none bg-transparent px-2 text-(--text-primary) outline-none placeholder:text-(--text-muted)',
          // 축소 상태에서는 입력창 높이를 낮춰 sticky 헤더 밀도를 높입니다.
          compact ? 'h-8 text-sm' : 'h-10 text-base',
        ].join(' ')}
      />

      <button
        type='button'
        aria-label='검색 실행'
        className={[
          // 검색 실행 버튼은 기본 버튼 형태로 둡니다.
          'ml-2 inline-flex shrink-0 items-center justify-center rounded-md border border-(--accent-green) bg-(--accent-green) font-medium text-white',
          // 축소 상태에서는 버튼 크기도 함께 줄여 밀도를 맞춥니다.
          compact ? 'h-8 px-3 text-xs' : 'h-10 px-4 text-sm',
        ].join(' ')}>
        검색
      </button>
    </section>
  );
}

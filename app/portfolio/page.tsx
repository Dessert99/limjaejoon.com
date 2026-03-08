// 포트폴리오 페이지 파일 책임: 개인 핵심 정보(프로필/기술스택/활동)를 학습 친화적 섹션으로 렌더링합니다.
// 입력/처리/출력 요약: 정적 배열 데이터를 정의하고, 카드 섹션으로 매핑해 `/portfolio` 화면으로 출력합니다.
// Server/Client 성격: 사용자 상호작용 상태가 없어 Server Component로 유지해 렌더링 복잡도를 낮춥니다.

// 정적 이미지를 최적화된 형태로 렌더링하기 위해 Next Image를 사용합니다.
import Image from 'next/image';
// 기술 스택 아이콘 타입을 명시해 배열 데이터의 아이콘 필드를 안전하게 관리합니다.
import type { IconType } from 'react-icons';
// React/Expo 브랜드 아이콘을 기술 스택 카드에서 재사용합니다.
import { SiExpo, SiReact } from 'react-icons/si';

// 기술 스택 카드 데이터의 형태를 고정해 렌더링 누락을 방지합니다.
interface TechStackItem {
  // 목록 렌더링 key로 사용하는 고유 식별자입니다.
  id: string;
  // 사용자에게 보이는 기술 이름입니다.
  name: string;
  // react-icons 컴포넌트를 동적으로 렌더링하기 위한 아이콘 타입입니다.
  icon: IconType;
  // 브랜드 색상을 Tailwind 클래스 문자열로 주입하기 위한 필드입니다.
  iconColorClass: string;
}

// 활동 섹션 그룹 데이터의 형태를 고정해 단체별 이력을 명확히 분리합니다.
interface ActivityGroup {
  // 목록 렌더링 key로 사용하는 고유 식별자입니다.
  id: string;
  // 활동 단체 이름입니다.
  organization: string;
  // 단체 내 역할 목록입니다.
  roles: string[];
}

// 기술 스택 섹션에서 사용하는 정적 데이터입니다.
const techStackItems: TechStackItem[] = [
  {
    // React 카드 식별자입니다.
    id: 'react',
    // 기술 이름을 노출합니다.
    name: 'React',
    // React 공식 브랜드 아이콘을 사용합니다.
    icon: SiReact,
    // React 브랜드 컬러를 적용해 즉시 식별되도록 구성합니다.
    iconColorClass: 'text-sky-400',
  },
  {
    // React Native 카드 식별자입니다.
    id: 'react-native',
    // 기술 이름을 노출합니다.
    name: 'React Native',
    // 요청사항에 맞춰 React 아이콘을 재사용하고 텍스트로 Native를 구분합니다.
    icon: SiReact,
    // React Native도 React 계열 브랜드 톤을 유지합니다.
    iconColorClass: 'text-sky-300',
  },
  {
    // Expo 카드 식별자입니다.
    id: 'expo',
    // 기술 이름을 노출합니다.
    name: 'Expo',
    // Expo 브랜드 아이콘을 사용합니다.
    icon: SiExpo,
    // Expo는 다크 배경 대비를 위해 고대비 흰색 톤을 사용합니다.
    iconColorClass: 'text-white',
  },
];

// 활동 섹션에서 사용하는 정적 데이터입니다.
const activityGroups: ActivityGroup[] = [
  {
    // 멋쟁이사자처럼 그룹 식별자입니다.
    id: 'likelion',
    // 단체 이름을 노출합니다.
    organization: '멋쟁이사자처럼',
    // 사용자가 전달한 기수/역할 정보를 그대로 유지합니다.
    roles: ['13기 멤버', '14기 프론트엔드 운영진'],
  },
  {
    // GDG on HUFS 그룹 식별자입니다.
    id: 'gdg-on-hufs',
    // 단체 이름을 노출합니다.
    organization: 'GDG on HUFS',
    // 사용자가 전달한 기수/역할 정보를 그대로 유지합니다.
    roles: ['6기 멤버', '7기 코어멤버'],
  },
];

// 포트폴리오 페이지 엔트리 컴포넌트입니다.
export default function PortfolioPage() {
  return (
    // 본문 폭을 제한해 가독성을 유지하고 반응형 여백을 적용합니다.
    <main className='mx-auto min-h-screen w-full max-w-7xl px-4 py-10 md:px-6'>
      {/* 페이지의 시맨틱 제목을 노출합니다. */}
      <h1 className='text-3xl font-semibold tracking-tight text-text-primary md:text-4xl'>
        포트폴리오
      </h1>

      {/* 상단 히어로에서 프로필 핵심 정보를 먼저 전달합니다. */}
      <section className='surface-card mt-6 p-6 md:p-8'>
        {/* 모바일 우선 1열, 데스크톱 2열로 전환해 정보 우선순위를 유지합니다. */}
        <div className='grid gap-6 md:grid-cols-5 md:items-center'>
          {/* 프로필 로고 이미지를 고정 크기로 표시해 시각적 기준점을 만듭니다. */}
          <div className='justify-self-start overflow-hidden rounded-2xl border border-line-soft bg-bg-soft md:col-span-1'>
            <Image
              // 사용자가 지정한 로고 파일 경로를 그대로 사용합니다.
              src='/images/logo.png'
              // 이미지 의미를 설명하는 대체 텍스트입니다.
              alt='포트폴리오 프로필 로고'
              // 레이아웃 안정성을 위해 고정 너비를 지정합니다.
              width={144}
              // 레이아웃 안정성을 위해 고정 높이를 지정합니다.
              height={144}
              // 박스를 채우도록 cover 모드를 적용합니다.
              className='h-36 w-36 object-cover'
              // 히어로 핵심 이미지라 우선 로딩합니다.
              priority
            />
          </div>

          {/* 텍스트 정보 묶음을 세로로 배치해 읽기 흐름을 단순화합니다. */}
          <div className='md:col-span-4'>
            {/* 섹션 레이블을 추가해 페이지 목적을 즉시 인지하도록 돕습니다. */}
            <p className='text-xs font-semibold uppercase tracking-widest text-accent-strong'>
              Portfolio Profile
            </p>
            {/* 학교명을 핵심 아이덴티티로 강조합니다. */}
            <p className='mt-3 text-2xl font-semibold text-text-primary md:text-3xl'>
              프론트엔드 개발자 임재준
            </p>
          </div>
        </div>
      </section>

      {/* 기술 스택/활동 섹션을 2열로 구성해 정보 탐색 효율을 높입니다. */}
      <section className='mt-6 grid gap-4 lg:grid-cols-2'>
        {/* 기술 스택 카드 영역입니다. */}
        <article className='surface-card p-6'>
          {/* 섹션 제목을 노출합니다. */}
          <h2 className='text-xl font-semibold text-text-primary'>
            기술 스택
          </h2>
          {/* 기술 카드 목록 간격을 설정합니다. */}
          <ul className='mt-4 space-y-3'>
            {/* 정적 배열 데이터를 UI 카드로 매핑합니다. */}
            {techStackItems.map((stack) => {
              // 배열 데이터의 아이콘 컴포넌트를 변수로 꺼내 JSX에서 재사용합니다.
              const StackIcon = stack.icon;

              return (
                // 각 기술 항목을 카드 형태로 렌더링합니다.
                <li
                  key={stack.id}
                  className='surface-subtle flex items-center gap-3 p-4'>
                  {/* 아이콘 배경 칩을 둬 시인성을 높입니다. */}
                  <span className='inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line-soft bg-bg-elevated'>
                    <StackIcon
                      // 아이콘은 장식 요소이므로 스크린 리더에서 제외합니다.
                      aria-hidden='true'
                      // 브랜드 컬러와 공통 크기를 함께 적용합니다.
                      className={`text-2xl ${stack.iconColorClass}`}
                    />
                  </span>

                  {/* 기술 이름을 카드 제목으로 표시합니다. */}
                  <strong className='block text-sm font-semibold text-text-primary md:text-base'>
                    {stack.name}
                  </strong>
                </li>
              );
            })}
          </ul>
        </article>

        {/* 활동 카드 영역입니다. */}
        <article className='surface-card p-6'>
          {/* 섹션 제목을 노출합니다. */}
          <h2 className='text-xl font-semibold text-text-primary'>활동</h2>
          {/* 단체별 활동 그룹 간 간격을 설정합니다. */}
          <div className='mt-4 space-y-4'>
            {/* 단체 데이터를 카드형 블록으로 렌더링합니다. */}
            {activityGroups.map((group) => (
              <section
                key={group.id}
                className='surface-subtle p-4'>
                {/* 단체명을 강조 텍스트로 노출합니다. */}
                <h3 className='text-sm font-semibold uppercase tracking-widest text-accent-strong'>
                  {group.organization}
                </h3>
                {/* 역할 목록을 불릿으로 표시해 이력 구분을 명확히 합니다. */}
                <ul className='mt-3 space-y-2'>
                  {/* 역할 데이터를 순회해 한 줄씩 출력합니다. */}
                  {group.roles.map((role) => (
                    <li
                      key={role}
                      className='text-sm text-text-secondary md:text-base'>
                      {role}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

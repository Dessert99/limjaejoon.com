import Image from 'next/image';

/** 어바웃 한가운데 서는 세로 활동 이력. 마디마다 동그란 사진에서 우측으로 가지가 뻗어 설명이 붙는다. */
export function ActivityTimeline() {
  const activities = [
    {
      period: '2024.09 — 2025.08',
      role: 'Member',
      title: 'GDG on Campus HUFS',
      image: '/images/timeline/gdg.png',
      body: '6기 Member로 합류했습니다. 한국외대에서 가장 활발한 개발 커뮤니티에서 여러 사람을 만나며 개발자라는 직업에 대해 매력을 느끼기 시작했습니다.',
    },
    {
      period: '2025.03 — 2026.01',
      role: '멤버 · 프론트엔드 트랙',
      title: '멋쟁이사자처럼 HUFS',
      image: '/images/timeline/likelion.avif',
      body: '본격적으로 개발을 공부하려고 13기 프론트엔드 트랙에 합류했습니다. HTML·CSS·JavaScript·React로 기본을 다지고, 여러 해커톤과 프로젝트에서 협업을 익혔습니다. 이곳에서 프론트엔드 세계에 몰입할 수 있었습니다.',
    },
    {
      period: '2025.08 — 2026.08',
      role: 'Core Member',
      title: 'GDG on Campus HUFS',
      image: '/images/timeline/gdg.png',
      body: '개발 커뮤니티 활성화에 기여하고자 GDG 7기 운영진으로 활동했습니다. 리액트 스터디와 교내 알고리즘 대회를 기획·운영하며 개발 커뮤니티를 넓히는 데 힘을 보탰습니다.',
    },
    {
      period: '2026.01 — 현재',
      role: '운영진 · 프론트엔드 팀장',
      title: '멋쟁이사자처럼 HUFS',
      image: '/images/timeline/likelion.avif',
      body: '멋쟁이사자처럼 14기 프론트엔드 트랙 운영진으로 활동하고 있습니다. 매주 리액트 세션을 진행하며 멤버들에게 프론트엔드 기술을 전하고 있습니다. 개발 입문자들이 프론트엔드를 쉽게 배울 수 있도록 돕고 있습니다.',
    },
    {
      period: '2026.08 — 현재',
      role: 'Core Member',
      title: 'GDG on Campus HUFS',
      image: '/images/timeline/gdg.png',
      body: '7기에 이어 8기 운영진으로 활동하고 있습니다. 운영을 돕는 데 그치지 않고, 개발자로서 쌓은 경험을 나누며 함께 성장하는 분위기를 만들려 합니다.',
    },
  ];

  return (
    // motion-safe에서만 절대 배치로 화면을 통째로 차지한다. 모션을 끈 기기에선 일수 문구 아래에 그냥 쌓인다
    <div className='flex items-center text-left motion-safe:absolute motion-safe:inset-0 motion-safe:px-home-gutter'>
      {/* pl이 축을 세우는 자리. 키우면 축이 화면 가운데로 오고 오른쪽에 남는 폭이 줄어든다 */}
      <ol
        data-timeline-list
        className='w-full sm:pl-[12%] lg:pl-[16%]'>
        {activities.map((activity, index) => {
          return (
            <li
              key={activity.period}
              className='grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6 lg:gap-x-8'>
              <div className='flex flex-col items-center'>
                {/* 원 안을 이미지로 채우려면 부모가 크기를 쥐고 있어야 해서 relative를 준다 */}
                {/* 로고가 흰 바탕에 그려져 있어, 원을 흰 판으로 깔아야 잘린 자국 없이 얹힌다 */}
                <span
                  data-timeline-node
                  className='relative size-11 shrink-0 overflow-hidden rounded-full bg-home-logo-plate sm:size-16 lg:size-20'>
                  {/* p가 로고와 원 테두리 사이 여백. 줄이면 로고 모서리가 원에 잘린다 */}
                  <Image
                    src={activity.image}
                    alt=''
                    fill
                    sizes='(min-width: 1024px) 5rem, (min-width: 640px) 4rem, 2.75rem'
                    className='object-contain p-1.5 sm:p-2'
                  />
                </span>

                {/* 마지막 마디 아래로는 줄기를 잇지 않아야 꼬리가 남지 않는다 */}
                {index < activities.length - 1 && (
                  <span
                    data-timeline-stem
                    className='w-px flex-1 origin-top bg-home-foreground/25'
                  />
                )}
              </div>

              {/* pb가 마디 사이 간격. 키우면 줄기가 길어지고 타임라인 전체가 늘어난다 */}
              <div className='flex items-start gap-3 pb-6 sm:gap-4 sm:pb-10 lg:gap-6'>
                {/* mt가 원 지름의 절반이라야 가지가 원 한가운데에서 나온다 */}
                <span
                  data-timeline-branch
                  className='mt-[1.375rem] h-px w-5 shrink-0 origin-left bg-home-foreground/25 sm:mt-8 sm:w-10 lg:w-16'
                />

                <div data-timeline-copy>
                  <p className='text-[0.65rem] tracking-widest opacity-50 sm:text-xs lg:text-sm'>
                    {activity.period} · {activity.role}
                  </p>

                  <h3 className='mt-1 text-base font-medium sm:text-xl lg:text-2xl'>
                    {activity.title}
                  </h3>

                  <p className='mt-1.5 max-w-prose text-xs opacity-70 sm:mt-2 sm:text-sm lg:text-base'>
                    {activity.body}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

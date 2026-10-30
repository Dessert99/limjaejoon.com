import Image from 'next/image';

/** 활동 한 편의 설명 판. 로고가 서는 절반은 비워 두고 나머지 절반에 기간·역할·소개를 세운다. */
export function WorkPanel({
  logo,
  period,
  role,
  title,
  body,
}: {
  logo: string;
  period: string;
  role: string;
  title: string;
  body: string;
}) {
  return (
    // motion-safe에서만 절대 배치로 판을 포개, 두 활동이 같은 자리에서 교대한다
    <article className='flex min-h-svh flex-col px-home-gutter py-24 motion-safe:absolute motion-safe:inset-0 lg:flex-row lg:items-center'>
      {/* 3D가 쓰는 자리. 모션을 끈 기기에선 여기에 원본 로고를 그대로 눕힌다 */}
      <div className='relative flex-1'>
        <Image
          src={logo}
          alt={`${title} 로고`}
          fill
          // 옵티마이저가 SVG를 거절해서 원본을 그대로 내보낸다
          unoptimized
          sizes='(min-width: 1024px) 50vw, 100vw'
          className='object-contain motion-safe:hidden'
        />
      </div>

      <div
        data-work-copy
        className='flex flex-1 flex-col justify-center text-left'>
        <p className='text-xs tracking-widest opacity-50 sm:text-sm'>
          {period} · {role}
        </p>

        <h3 className='mt-2 text-3xl font-medium sm:text-4xl lg:text-5xl'>
          {title}
        </h3>

        <p className='mt-4 max-w-prose text-sm opacity-70 sm:text-base'>
          {body}
        </p>
      </div>
    </article>
  );
}

import { Github, Instagram, Settings } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-black text-white p-4'>
      {/* 1. 애니메이션 섹션 (Pure CSS/Tailwind) */}
      <div className='flex flex-col items-center justify-center gap-6'>
        {/* Tailwind v4의 Arbitrary Values 문법 사용 
           animate-[이름_시간_이징_반복] 
        */}
        <div className='animate-[spin_4s_linear_infinite]'>
          <Settings
            size={64}
            className='text-white/90'
          />
        </div>

        <div className='text-center'>
          <h1 className='text-3xl font-bold tracking-tighter md:text-5xl flex items-center justify-center gap-1'>
            <span>페이지 준비중</span>

            {/* 점 3개 애니메이션 (delay로 순차적 깜빡임 구현) */}
            <span className='flex'>
              <span className='animate-[pulse_1.5s_ease-in-out_infinite]'>
                .
              </span>
              <span className='animate-[pulse_1.5s_ease-in-out_infinite] delay-150'>
                .
              </span>
              <span className='animate-[pulse_1.5s_ease-in-out_infinite] delay-300'>
                .
              </span>
            </span>
          </h1>
        </div>
      </div>

      <div className='mt-20 flex flex-col items-center gap-4 animate-[bounce_1s_ease-out_1]'>
        <h2 className='text-sm font-medium uppercase tracking-widest text-gray-500'>
          Contact
        </h2>

        <div className='flex items-center gap-6 rounded-full border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/10'>
          {/* 깃허브 */}
          <Link
            href='https://github.com/Dessert99'
            target='_blank'
            className='transition-transform duration-300 hover:scale-110 hover:text-gray-300'>
            <Github size={28} />
          </Link>

          <div className='h-4 w-2 bg-white/20'></div>

          {/* 인스타그램 */}
          <Link
            href='https://www.instagram.com/j.jo_on?igsh=dDM2cnp6c3Fhbm5w'
            target='_blank'
            className='transition-transform duration-300 hover:scale-110 hover:text-gray-300'>
            <Instagram size={28} />
          </Link>
        </div>
      </div>
    </main>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Github, Instagram, Settings } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-black text-white p-4'>
      <div className='flex flex-col items-center justify-center gap-6'>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
          <Settings
            size={64}
            className='text-white opacity-90'
          />
        </motion.div>

        <div className='text-center'>
          <h1 className='text-3xl font-bold tracking-tighter md:text-5xl'>
            페이지 준비중
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}>
              .
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}>
              .
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}>
              .
            </motion.span>
          </h1>
        </div>
      </div>

      {/* 2. Contact & SNS 링크 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className='mt-20 flex flex-col items-center gap-4'>
        <h2 className='text-sm font-medium uppercase tracking-widest text-gray-500'>
          Contact
        </h2>

        <div className='flex items-center gap-6 rounded-full border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-sm'>
          <Link
            href='https://github.com/Dessert99'
            target='_blank'
            className='transition-transform hover:scale-110 hover:text-gray-300'>
            <Github size={28} />
          </Link>

          <div className='h-4 w-[1px] bg-white/20'></div>

          <Link
            href='https://www.instagram.com/j.jo_on?igsh=dDM2cnp6c3Fhbm5w'
            target='_blank'
            className='transition-transform hover:scale-110 hover:text-gray-300'>
            <Instagram size={28} />
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

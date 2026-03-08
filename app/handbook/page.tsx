import { CssCard } from '@/features/handbook/css/components/CssCard';
import { HtmlCard } from '@/features/handbook/html/components/HtmlCard';
import { JsCard } from '@/features/handbook/js/components/JsCard';
import { TsCard } from '@/features/handbook/ts/components/TsCard';

export default function HandbookPage() {
  return (
    <main className='mx-auto min-h-screen w-full max-w-6xl md:px-6'>
      {/* 노트북 4줄, 모바일 2줄 */}
      <section className='px-4 grid grid-cols-2 gap-4 md:grid-cols-4'>
        <HtmlCard />
        <CssCard />
        <JsCard />
        <TsCard />
      </section>
    </main>
  );
}

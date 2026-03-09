import { CssCard } from '@/features/handbook/shared/components/cards/CssCard';
import { HtmlCard } from '@/features/handbook/shared/components/cards/HtmlCard';
import { JsCard } from '@/features/handbook/shared/components/cards/JsCard';
import { TsCard } from '@/features/handbook/shared/components/cards/TsCard';

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

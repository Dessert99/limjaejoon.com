// 핸드북 홈 전용 카테고리 데이터 목록을 가져옵니다.
import { handbookHubCategories } from '@/features/handbook/config/hubCategories';
// 홈 화면에서 사용할 비클릭 카드 UI 컴포넌트를 가져옵니다.
import { HandbookEntryCard } from '@/features/handbook/components/HandbookEntryCard';

// 핸드북 페이지: 자주 진입하는 코드 학습 허브 화면입니다.
export default function HandbookPage() {
  // 핸드북 페이지 UI를 렌더합니다.
  return (
    <main className='mx-auto min-h-screen w-full md:px-6'>
      {/* 카테고리 섹션: 4개 카테고리 카드를 2열 그리드로 배치합니다. */}
      <section className='mt-8'>
        <div className='grid gap-4 md:grid-cols-2'>
          {/* 카테고리 데이터 배열을 순회해 카드 컴포넌트를 렌더합니다. */}
          {handbookHubCategories.map((category) => (
            <HandbookEntryCard
              key={category.id}
              category={category}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

import { StoriesSection } from '@/features/blog/components/StoriesSection';
import { getStoryList } from '@/features/blog/lib/posts';
import * as s from './page.css';

export default function Home() {
  const stories = getStoryList();
  const storyTags = [...new Set(stories.flatMap((s) => s.tags))].sort();

  return (
    <main className={s.main}>
      <section className={s.hero}>
        <h1 className={s.heroName}>안녕하세요, 임재준입니다.</h1>
        <p className={s.heroRole}>프론트엔드 개발자</p>
        <p className={s.heroDesc}>성장을 코드로 기록합니다.</p>
      </section>

      <StoriesSection
        stories={stories}
        tags={storyTags}
      />
    </main>
  );
}

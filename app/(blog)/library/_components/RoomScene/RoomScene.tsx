'use client';

import { Canvas } from '@react-three/fiber';
import { useRouter } from 'next/navigation';
import { useRef, useState, useSyncExternalStore } from 'react';
import { useCurtainStart } from '@/domains/transition/ui/RouteTransition';
import { gsap } from '@/lib/motion/gsap';
import type { Book } from '@/domains/books/types/book.types';
import { type PostListItem } from '@/domains/posts/types/post.types';
import { Backdrop } from './Backdrop';
import { BookModal } from './BookModal';
import { BookPile } from './BookPile';
import { WindowSign } from './WindowSign';
import { Stage } from './Stage';
import { RenderWhileTweening } from './RenderWhileTweening';

/** 서재가 쌓는 기록 칸. pushed는 우리가 push한 칸이라 back()으로 걷어도 서재를 안 떠난다는 표시다. */
type LibraryState = { pile?: string; pushed?: boolean };

const listeners = new Set<() => void>();
let popstateBound = false;

const notify = () => {
  listeners.forEach((listener) => {
    listener();
  });
};

const subscribe = (onStoreChange: () => void) => {
  listeners.add(onStoreChange);

  // 뒤로 가기는 push/replace를 안 거치므로 popstate를 따로 받아야 방이 따라온다
  if (!popstateBound) {
    window.addEventListener('popstate', notify);
    popstateBound = true;
  }

  return () => {
    listeners.delete(onStoreChange);
  };
};

const readState = (): LibraryState => {
  return (window.history.state ?? {}) as LibraryState;
};

// 스냅샷은 문자열이어야 매번 새 객체로 무한 렌더가 돌지 않는다. 주소의 책과 기록 칸의 더미를 한 줄로 묶는다
const getSnapshot = () => {
  return `${window.location.search}\n${readState().pile ?? ''}`;
};

// 서버에는 주소창도 기록도 없다. 빈 값으로 맞춰야 하이드레이션이 어긋나지 않는다
const getServerSnapshot = () => {
  return '\n';
};

// Next가 pushState/replaceState를 가로채 자기 상태를 덧붙이므로, 넘긴 객체에 우리 키만 담아도 라우터가 깨지지 않는다
const push = (state: LibraryState, url?: string) => {
  window.history.pushState(state, '', url);
  notify();
};

const replace = (state: LibraryState, url?: string) => {
  window.history.replaceState(state, '', url);
  notify();
};

/** 펼친 더미·연 책을 브라우저 기록에 한 칸씩 쌓아, 뒤로 가기가 책 → 더미 → 서재 순으로 하나씩 닫게 한다. */
const useLibraryHistory = () => {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const [search, pileValue] = snapshot.split('\n');
  const book = new URLSearchParams(search).get('book') ?? '';
  const pile = pileValue || null;

  // 더미끼리 옮겨 다니는 건 덮어써서, 몇 번을 옮겨도 뒤로 한 번에 접힌다. 주소는 안 바꿔 Next 라우터가 돌지 않는다
  const spread = (group: string) => {
    if (group === pile) {
      return;
    }

    const state = readState();

    if (state.pushed) {
      replace({ pile: group, pushed: true });
    } else {
      push({ pile: group, pushed: true });
    }
  };

  const open = (slug: string) => {
    push(
      { pile: pile ?? undefined, pushed: true },
      `?book=${encodeURIComponent(slug)}`
    );
  };

  // 우리가 쌓은 칸이면 back()으로 걷어 기록과 화면을 맞춘다. 공유 링크로 바로 들어온 칸은 back()하면 서재를 떠나므로 덮어써 지운다
  const close = (fallbackPile: string | null) => {
    if (readState().pushed) {
      window.history.back();
    } else {
      replace({ pile: fallbackPile ?? undefined }, window.location.pathname);
    }
  };

  const fold = () => {
    if (!pile) {
      return;
    }

    if (readState().pushed) {
      window.history.back();
    } else {
      replace({});
    }
  };

  return { pile, book, spread, open, close, fold };
};

/** 블로그 홈. 방 이미지 위에 분류별 3D 책 더미를 얹고, 책을 열면 그 책의 글 목록이 방 위에 뜬다. */
export function RoomScene({
  books,
  posts,
}: {
  books: Book[];
  posts: PostListItem[];
}) {
  const {
    pile,
    book: openSlug,
    spread,
    open,
    close,
    fold,
  } = useLibraryHistory();
  const router = useRouter();
  const startCurtain = useCurtainStart();
  // 창문으로 나가는 진행도. GSAP이 직접 돌리고 배경과 카메라가 매 프레임 읽는다
  const leave = useRef({ progress: 0 });
  const [leaving, setLeaving] = useState(false);
  // 목록은 책이 카메라 앞에 도착한 뒤에 뜬다
  const [arrived, setArrived] = useState(false);
  const [arrivedSlug, setArrivedSlug] = useState(openSlug);

  // 뒤로·앞으로 가기로 책이 바뀌면 이벤트 없이 주소만 바뀐다. 렌더 중에 도착을 되돌려야 새 책이 날아오기 전에 목록이 먼저 뜨지 않는다
  if (arrivedSlug !== openSlug) {
    setArrivedSlug(openSlug);
    setArrived(false);
  }
  const openBook = books.find((book) => {
    return book.slug === openSlug;
  });

  const leaveRoom = () => {
    if (gsap.isTweening(leave.current)) {
      return;
    }

    if (
      !startCurtain ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      router.push('/experience');
      return;
    }

    setLeaving(true);
    gsap
      .timeline()
      // 1.4초. 늘리면 창으로 천천히 걸어가고, 줄이면 확 빨려 든다. in 곡선이라 끝으로 갈수록 빨라진다
      .to(leave.current, { progress: 1, duration: 1.4, ease: 'power2.in' })
      // 0.9초에 커튼을 내린다. 당기면 창에 닿기 전에 가려지고, 미루면 다 다가간 뒤 잠깐 멈춰 보인다
      .call(startCurtain, ['/experience'], 0.9);
  };

  return (
    <>
      {/* 카메라는 테이블 면(y=0)에서 0.55m 위, 3° 아래를 본다. 사진 속 시점과 맞춘 값이라 바꾸면 책이 테이블에서 뜬다 */}
      <Canvas
        // 방이 멈춰 있으면 다시 그리지 않는다. 목록 카드가 떠 있는 동안 GPU가 쉬고 뒤 블러도 한 번만 계산된다
        frameloop='demand'
        camera={{
          fov: 44,
          position: [0, 0.55, 0],
          rotation: [-0.052, 0, 0],
          near: 0.1,
          far: 20,
        }}
        onPointerMissed={fold}>
        <Backdrop
          leave={leave}
          onLeave={leaveRoom}
        />
        <Stage leave={leave} />
        <RenderWhileTweening />
        {/* 방 전체를 은은하게. 올리면 책 옆면 그늘이 옅어져 두께가 안 보인다 */}
        <ambientLight intensity={0.6} />
        {/* 오른쪽 벽난로 쪽에서 오는 따뜻한 주광. 책 표지에 사진과 같은 방향의 빛이 든다 */}
        <directionalLight
          position={[3, 2, 1]}
          color='#ffc98a'
          intensity={1.8}
        />
        {/* 왼쪽 창에서 오는 차가운 보조광. 끄면 책등 쪽이 배경에 묻힌다 */}
        <directionalLight
          position={[-3, 2, 1]}
          color='#8fa6ff'
          intensity={0.5}
        />
        <BookPile
          topics={books.map((book) => {
            return {
              title: book.title,
              group: book.category,
              slug: book.slug,
              color: book.color,
              // 마이그레이션 전 DB에는 logo 열이 없어 undefined가 온다. 로고 없는 표지로 둔다
              logo: book.logo ?? null,
            };
          })}
          // 주소로 책이 열린 채 들어오면 그 책의 더미도 펼쳐 둬야 방과 목록이 어긋나지 않는다
          spreadGroup={pile ?? openBook?.category ?? null}
          openSlug={openSlug}
          onSpread={spread}
          onOpen={open}
          onArrive={() => {
            setArrived(true);
          }}
        />
      </Canvas>
      {/* 더미를 펼치거나 책을 열면 공중에 뜬 책 위로 선이 그려지므로, 방이 비어 있을 때만 창문 신호를 켠다 */}
      {pile || openSlug || leaving ? null : <WindowSign />}
      <BookModal
        book={arrived ? openBook : undefined}
        posts={posts.filter((post) => {
          return post.book?.slug === openSlug;
        })}
        onClose={() => {
          // 닫아도 방금 보던 더미는 펼친 채 남겨 옆 책으로 바로 옮겨 갈 수 있게 한다
          close(openBook?.category ?? null);
        }}
      />
    </>
  );
}

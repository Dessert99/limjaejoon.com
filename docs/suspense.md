# React Suspense

1. 리액트 컴포넌트는 렌더링 중에 데이터가 아직 준비되지 않았을 때, 기존에는 `isLoading` 같은 상태를 직접 관리해야 했다.
2. 이 방식은 컴포넌트마다 로딩 상태와 에러 상태를 각각 선언하고 조건부 렌더링으로 분기해야 해서 코드가 복잡해졌다.

```tsx
// 기존 방식: 로딩 상태를 컴포넌트 안에서 직접 관리
function Profile() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser().then((user) => {
      setData(user);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <Spinner />;
  return <div>{data.name}</div>;
}
```

3. 또한 여러 컴포넌트가 중첩되어 각각 데이터를 불러오면, 위에서부터 순서대로 요청이 실행되는 "워터폴 문제"가 발생했다.
4. 부모가 렌더링 되어야 자식이 존재하고, 자식이 마운트되어야 비로소 자식의 fetch가 시작되는 구조이기 때문이다.

```
부모 렌더 → 부모 fetch → 부모 완료
  → 자식 렌더 → 자식 fetch → 자식 완료   (순차적으로 대기)
```

5. Suspense는 이 문제를 해결하기 위해 도입된 리액트의 비동기 렌더링 메커니즘이다.
6. 컴포넌트가 아직 준비되지 않았을 때 렌더링을 "일시 정지"시키고, 준비가 완료되면 자동으로 다시 렌더링한다.
7. 데이터를 기다리는 동안 보여줄 UI는 컴포넌트 바깥에서 `<Suspense fallback={...}>` 형태로 선언적으로 지정한다.

```tsx
// Suspense 방식: 로딩 UI를 컴포넌트 밖으로 분리
function Profile() {
  const data = use(fetchUser()); // 데이터가 없으면 렌더링이 일시 정지됨
  return <div>{data.name}</div>;
}

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Profile />
    </Suspense>
  );
}
```

8. 컴포넌트가 렌더링을 일시 정지하는 원리는 Promise를 throw하는 것이다.
9. 리액트는 throw된 Promise를 감지하고, 가장 가까운 `<Suspense>` 경계까지 올라가 fallback을 렌더링한다.
10. Promise가 resolve되면 리액트는 해당 컴포넌트를 다시 렌더링 시도한다.

```tsx
// 리액트 내부 동작을 단순화한 개념 코드
function fetchUserResource(id: string) {
  let status = "pending";
  let result: User;

  const promise = fetchUser(id).then((data) => {
    status = "success";
    result = data;
  });

  return {
    read() {
      if (status === "pending") throw promise;  // 아직 준비 안 됨 → 일시 정지
      if (status === "error") throw result;     // 에러 → ErrorBoundary로 전달
      return result;                            // 완료 → 정상 렌더링
    },
  };
}
```

11. Next.js App Router에서는 서버 컴포넌트가 `async/await`을 직접 사용하면 리액트가 이를 Suspense와 동일하게 처리한다.
12. 즉, 서버 컴포넌트 내부에서 `await`를 만나면 해당 컴포넌트의 렌더링이 일시 정지되고, 가장 가까운 `loading.tsx` 또는 `<Suspense>` fallback이 그 자리를 채운다.

```tsx
// app/blog/[slug]/page.tsx — async 서버 컴포넌트
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug); // await 중에 Suspense 일시 정지
  return <article>{post.content}</article>;
}

// app/blog/[slug]/loading.tsx — 자동으로 Suspense fallback 역할
export default function Loading() {
  return <div>불러오는 중...</div>;
}
```

13. Suspense의 핵심 의의는 "언제 준비됐는지"를 컴포넌트 내부가 아닌 렌더링 경계에서 선언적으로 관리하게 해준다는 점이다.
14. 이로 인해 데이터 페칭 로직과 로딩 UI가 분리되고, 각 컴포넌트는 "데이터가 있다는 가정 하에" 렌더링만 담당할 수 있게 된다.
15. Suspense를 활용하면 페이지 전체를 기다리게 하지 않고, 뼈대 HTML은 즉시 클라이언트에 전달하고 데이터가 필요한 부분만 fallback으로 남길 수 있다.
16. 데이터가 준비되면 그 부분만 교체되어 스트리밍되므로, 사용자는 페이지가 완전히 완성되길 기다리지 않아도 된다.
17. 이것이 Streaming SSR이며, Next.js App Router에서 Suspense 경계가 곧 스트리밍 청크의 경계가 된다.

```tsx
export default function Page() {
  return (
    <div>
      <Header />         {/* 즉시 렌더링 */}
      <Suspense fallback={<PostSkeleton />}>
        <BlogPosts />    {/* 데이터 준비되면 스트리밍 */}
      </Suspense>
      <Suspense fallback={<CommentSkeleton />}>
        <Comments />     {/* 독립적으로 스트리밍 */}
      </Suspense>
    </div>
  );
}
```

18. `BlogPosts`와 `Comments`는 서로를 기다리지 않고, 각자 준비되는 순서대로 독립적으로 스트리밍된다.
19. `loading.tsx`는 페이지 전체를 하나의 Suspense 경계로 감싸는 단축 문법이고, 컴포넌트 단위로 `<Suspense>`를 직접 쓰면 더 세밀하게 제어할 수 있다.

→ Suspense는 Promise throw를 통해 렌더링을 일시 정지하고, 데이터가 준비되면 자동으로 재개하는 방식으로 로딩 상태 관리를 컴포넌트 바깥으로 분리한다. Streaming SSR은 이 Suspense 경계를 HTML 전송 단위로 삼아, 준비된 부분부터 클라이언트에 흘려보내는 것이다.



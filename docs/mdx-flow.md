MDX 파일을 파싱해서 데이터로 가져오는 흐름

1. 블로그 포스트를 DB 없이 관리하려면 파일 시스템에 .mdx 파일을 저장하고 직접 읽어오는 방식이 필요하다.
2. Next.js는 서버 컴포넌트에서 Node.js의 fs 모듈에 접근할 수 있어, 빌드 또는 요청 시점에 파일을 읽을 수 있다.
3. getPostList()는 먼저 content/blog 디렉토리를 스캔해 .mdx 확장자를 가진 파일 목록을 수집한다.
4. 각 파일을 gray-matter로 읽으면 frontmatter(---)의 메타 데이터와 본문 content가 { data, content }로 분리된다.
5. 파일명에서 .mdx 확장자를 제거하면 해당 포스트의 URL slug가 된다.
6. 수집된 메타 데이터를 PostMeta 타입으로 가공한 뒤, date 문자열 비교를 통해 최신순(내림차순)으로 정렬해 반환한다.
7. getPostBySlug(slug)는 slug로 특정 파일을 찾아 본문(content)까지 포함한 Post 객체를 반환하며, 파일이 없으면 null을 반환한다.

→ MDX 파싱 흐름은 "디렉토리 스캔 → 파일 읽기 → frontmatter 파싱 → 타입 가공 → 정렬" 순서로 이루어진다.


path, cwd(), readdirSync 문법 및 원리

1. Node.js에서 파일 시스템을 다룰 때 경로를 직접 문자열로 작성하면 실행 환경(OS, CWD)에 따라 다르게 해석될 수 있다.
2. process.cwd()는 Node.js 프로세스가 실행된 디렉토리의 절대 경로를 반환해, 항상 프로젝트 루트를 기준으로 삼을 수 있게 해준다.
3. path.join()은 여러 경로 조각을 OS에 맞는 구분자(/, \)로 이어붙여 올바른 절대 경로를 생성한다.
4. path.join(process.cwd(), 'content/blog')는 "프로젝트 루트/content/blog"라는 절대 경로를 만든다.
5. fs.readdirSync(path)는 해당 디렉토리 내 파일/폴더 이름 목록을 배열로 동기적으로 반환한다.
6. "동기적"이란 파일 목록을 모두 읽을 때까지 다음 코드가 실행되지 않는다는 뜻이다.
7. Next.js 서버 컴포넌트나 빌드 타임 함수에서는 동기 방식이 문제가 없어 readdirSync를 사용한다.
8. .filter((f) => f.endsWith('.mdx'))로 .mdx 파일만 추려내면 불필요한 파일(예: .DS_Store)을 제거할 수 있다.

→ process.cwd()로 절대 경로 기준을 잡고, path.join()으로 경로를 조합하고, readdirSync()로 파일 목록을 읽는다.


gray-matter 문법 및 원리

1. MDX 파일 상단의 ---로 감싼 영역을 frontmatter라고 부르며, YAML 형식으로 메타 데이터를 작성하는 관례다.
2. gray-matter는 이 frontmatter를 파싱해주는 라이브러리로, matter(fileContent)를 호출하면 { data, content }를 반환한다.
3. data는 frontmatter에서 파싱된 객체(예: { title, date, tags })이고, content는 frontmatter를 제외한 본문 문자열이다.
4. matter()는 파일을 직접 읽지 않고 이미 읽어온 문자열을 받아 파싱하기 때문에, fs.readFileSync로 먼저 파일을 읽어야 한다.
5. 파싱 결과 data의 각 필드는 TypeScript에서 unknown 타입이므로, data.title as string처럼 타입 단언(as)으로 명시해줘야 한다.
6. tags처럼 없을 수도 있는 배열 필드는 ?? []로 기본값을 설정해 런타임 에러를 방지한다.
7. getPostBySlug()는 같은 방식으로 파싱하되, content까지 포함해 본문 렌더링에 사용한다.

→ gray-matter는 MDX 파일의 frontmatter와 본문을 { data, content }로 분리해 JS 객체로 사용할 수 있게 해준다.


useSearchParams, URLSearchParams 문법 및 원리

1. 태그 필터처럼 페이지를 새로고침 없이 URL 쿼리스트링으로 상태를 관리하고 싶은 상황이 생긴다.
2. URLSearchParams는 브라우저 내장 Web API로, ?tag=react&page=2 같은 쿼리스트링 문자열을 파싱하고 조작하는 객체다.
3. new URLSearchParams(searchParams.toString())은 현재 쿼리스트링을 기반으로 새 객체를 만들어 기존 값을 유지하면서 특정 키만 수정할 수 있게 해준다.
4. params.set('tag', tag)는 tag 키를 새 값으로 설정하고, params.delete('tag')는 해당 키를 제거하며, params.toString()은 다시 쿼리스트링 문자열로 직렬화한다.
5. useSearchParams는 Next.js의 클라이언트 훅으로, 현재 URL의 쿼리스트링을 읽어 URLSearchParams 인터페이스를 반환한다.
6. searchParams.get('tag')는 현재 URL에서 tag 값을 가져오고, 없으면 null을 반환한다.
7. router.push(url)로 새 URL로 이동하면 페이지 이동 없이 쿼리스트링만 바뀌고, useSearchParams가 이를 감지해 컴포넌트가 리렌더링된다.
8. useSearchParams를 사용하는 컴포넌트는 반드시 'use client'로 선언해야 한다.

→ useSearchParams로 현재 쿼리를 읽고, URLSearchParams로 값을 수정해 router.push()로 URL을 갱신하는 것이 태그 필터의 핵심 패턴이다.

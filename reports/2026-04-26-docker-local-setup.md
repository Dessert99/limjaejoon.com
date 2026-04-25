# Docker 로컬 개발 환경 세팅 (Backend + PostgreSQL)

## 이미지와 컨테이너의 관계

1. Docker를 처음 다룰 때 가장 헷갈리는 지점이 "이미지(image)와 컨테이너(container)는 뭐가 다른가"이고, 이 두 단어를 구분 못 하면 이후의 모든 명령어 흐름이 흐릿해진다.
2. 그래서 둘이 왜 따로 존재하는지부터 짚어야 하는데, 핵심은 "재현 가능한 환경"을 만들고 싶다는 요구에서 출발한다.
3. 같은 코드를 여러 머신(내 맥, 동료의 우분투, CI 서버)에서 똑같이 돌리려면 운영체제·런타임·의존성·소스코드가 동일하게 묶여 있어야 하는데, 이걸 한 덩어리로 동결시킨 결과물이 이미지다.
4. 이미지는 일종의 "스냅샷이자 청사진"이라서 한 번 만들어지면 바뀌지 않고(immutable), 여러 머신에 그대로 옮겨도 같은 내용을 담는다.
5. 그런데 청사진만 있어선 아무 일도 일어나지 않으니, 이 청사진을 실제로 켜서 프로세스로 살아 움직이게 만든 인스턴스가 컨테이너다.
6. 이미지는 클래스, 컨테이너는 그 클래스의 인스턴스라는 비유가 잘 맞고, 같은 이미지로 컨테이너를 10개 띄우면 10개의 독립된 실행 환경이 생긴다.
7. 이번 작업에서 우리가 한 일도 정확히 이 흐름을 따랐는데, `backend/Dockerfile.dev`를 `docker compose build`가 읽어 이미지를 굽고, 그 이미지를 `docker compose up`이 컨테이너로 인스턴스화한 것이다.

```
backend/Dockerfile.dev → docker compose build → 이미지(backend:latest)
이미지                 → docker compose up    → 컨테이너(limjaejooncom-backend-1)
```

8. `docker compose build`는 Dockerfile을 읽어 이미지를 만드는 단계까지만 가고, 이때 컨테이너는 아직 존재하지 않는다.
9. `docker compose up`은 그 이미지에서 새 컨테이너를 띄우는 단계라서, 이걸 호출해야 비로소 NestJS 프로세스가 실제로 돌기 시작한다.
10. 이 분리가 중요한 이유는 두 단계의 비용이 다르기 때문인데, 빌드는 무겁고 오래 걸리지만 컨테이너 실행은 가볍고 빠르다.
11. 그래서 코드를 안 바꿨다면 이미지를 재사용하고 컨테이너만 다시 띄워(`docker compose up`) 빠르게 재실행할 수 있고, Dockerfile이 바뀌어 새로 굽는 게 필요할 때만 `build`를 다시 부른다.
12. `docker compose down`으로 컨테이너를 지워도 이미지는 그대로 남아있다는 점도 같은 원리에서 나오는 결과로, 이미지는 라이브러리에 꽂힌 책처럼 다음 컨테이너를 위해 계속 보관된다.

→ 이미지는 한 번 굳히는 청사진, 컨테이너는 그걸 켜서 만든 실행 인스턴스이고, 비용 차이 때문에 이 둘을 별도 명령으로 분리해 다룬다.


## Dockerfile 레이어 캐시 전략

1. Dockerfile을 한 줄씩 읽다 보면 "왜 이 순서로 COPY 해야 하나"라는 의문이 생기는데, 이 답은 Docker가 이미지를 빌드하는 방식인 레이어(layer) 구조에서 나온다.
2. Docker는 Dockerfile의 명령 한 줄(`COPY`, `RUN` 등)이 끝날 때마다 그 결과물을 하나의 레이어로 굳혀 저장하고, 다음 빌드 때 같은 명령·같은 입력이면 그 레이어를 다시 만들지 않고 캐시에서 꺼내 쓴다.
3. 그런데 한 레이어가 캐시 무효화(cache miss)되는 순간, 그 뒤에 오는 모든 레이어도 함께 무효화돼서 다시 만들어진다.
4. 그래서 "변경이 거의 없는 것은 위로, 변경이 잦은 것은 아래로" 두는 게 레이어 캐시 전략의 핵심이고, 이 원칙이 곧 우리 `backend/Dockerfile.dev`의 COPY 순서를 결정했다.

```dockerfile
# [1단] 의존성 메타데이터만 먼저 (거의 안 바뀜)
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# [2단] 무거운 npm install (위 파일이 안 바뀌면 캐시됨)
RUN npm ci -w backend

# [3단] 소스 (자주 바뀜, 맨 아래)
COPY tsconfig.base.json ./
COPY backend ./backend
```

5. 1단에서 `package.json`/`package-lock.json`만 먼저 복사하는 이유는, 이 파일들은 새 의존성을 추가하기 전까진 거의 안 바뀌어서 2단의 `npm ci`까지 통째로 캐시될 수 있기 때문이다.
6. 만약 순서를 뒤집어서 소스부터 복사한다면, `app.service.ts` 한 글자만 고쳐도 그 뒤의 `npm ci`까지 다 무효화돼서 매번 의존성을 새로 받느라 빌드가 수십 초~수 분씩 늘어진다.
7. 즉 1단·2단의 위치는 의존성 설치라는 무거운 작업을 캐시에 남게 하기 위해 의도적으로 위에 둔 것이고, 3단의 소스는 어차피 매번 바뀔 거니까 캐시 무효화돼도 손해가 적은 곳으로 빠진 것이다.
8. 우리가 실제로 빌드를 두 번 돌려봤을 때 첫 빌드는 의존성 다운로드까지 다 도느라 오래 걸렸고, 두 번째 빌드는 1·2단이 `CACHED`로 표시되며 거의 즉시 끝났는데, 이게 바로 이 전략의 실질 효과다.
9. 정리하면 Dockerfile의 라인 순서는 단순한 코드 정리 문제가 아니라 빌드 속도와 캐시 적중률을 좌우하는 설계 결정이고, "변경 빈도 오름차순"이 그 설계의 일반 원칙이다.

→ Docker 빌드는 한 줄당 한 레이어로 캐시되며, 변경 빈도가 낮은 것을 위로 둘수록 캐시가 길게 살아남아 빌드가 빨라진다.


## 빌드 컨텍스트와 Dockerfile 경로 분리

1. 보통 단일 서비스 프로젝트라면 Dockerfile을 루트에 두고 그냥 `docker build .` 하면 끝이라 두 개념이 한 곳에 겹쳐 보이는데, 모노레포로 들어오면 이 둘이 반드시 분리돼야 하는 상황이 생긴다.
2. 먼저 두 단어부터 구분해야 하는데, 빌드 컨텍스트(context)는 Docker 데몬이 빌드 시작할 때 "이 디렉토리 트리를 통째로 너에게 전송할게"라고 정한 뿌리 경로이고, Dockerfile 경로는 그 안에서 "어떤 빌드 레시피 파일을 읽을지"를 가리키는 별개의 좌표다.
3. 우리 `docker-compose.yml`이 둘을 의도적으로 어긋나게 적은 이유가 여기 있다.

```yaml
backend:
  build:
    context: .                         # 컨텍스트는 모노레포 루트
    dockerfile: backend/Dockerfile.dev # 레시피는 backend 안
```

4. 만약 컨텍스트도 `backend/`로 잡으면 빌드 도중 `package-lock.json`(루트에 있음)이나 `frontend/package.json`에 접근할 수 없는데, npm workspaces로 묶인 모노레포는 이 파일들이 있어야만 의존성을 정확히 설치할 수 있어서 빌드가 깨진다.
5. 그렇다고 Dockerfile을 루트에 올리면 "backend 서비스에만 종속된 빌드 레시피가 루트에 떠 있다"는 어색한 구조가 되고, 나중에 frontend도 컨테이너화할 때 루트에 `Dockerfile.frontend.dev`, `Dockerfile.backend.dev` 식으로 같은 디렉토리에 몰려 더 더러워진다.
6. 그래서 정석은 컨텍스트는 모노레포 루트, Dockerfile은 그 서비스 디렉토리 안에 두는 형태로 어긋나게 잡는 것이고, 이러면 빌드 입력 범위는 충분하면서도 레시피 파일은 자기 서비스 폴더에 깔끔하게 머문다.
7. `.dockerignore`도 이 컨텍스트 위치를 따라가는데, 컨텍스트 루트의 `.dockerignore`만 적용되기 때문에 우리가 `.dockerignore`를 프로젝트 루트에 둔 것도 우연이 아니라 컨텍스트 결정의 자연스러운 결과다.
8. 이 두 좌표가 분리됐다는 사실을 한 번 인식하고 나면, 향후 frontend 컨테이너를 추가할 때도 똑같이 `context: .` + `dockerfile: frontend/Dockerfile.dev`로 대칭적으로 확장하면 되어 구조가 안정적으로 자란다.

→ 모노레포에선 빌드 컨텍스트와 Dockerfile 경로를 분리해서 컨텍스트는 루트, 레시피는 서비스 디렉토리 안에 두는 게 정석이다.


## npm workspaces가 frontend/package.json까지 요구하는 이유

1. 모노레포에서 의존성을 어떻게 관리하느냐가 Dockerfile 작성에 직접 영향을 미치는데, 우리 프로젝트는 npm workspaces라는 방식을 쓰고 있어서 이 점이 특히 중요하다.
2. npm workspaces는 루트 `package.json`에 `"workspaces": ["frontend", "backend"]` 같은 항목을 두고, 각 워크스페이스의 의존성을 루트 `node_modules`에 호이스팅(hoist)해서 한 번에 관리하는 방식이다.
3. 이 구조의 장점은 중복 설치가 없고 lockfile이 하나로 통합된다는 점인데, 단점은 루트 lockfile과 모든 워크스페이스의 package.json이 한 세트로 묶여야만 정확한 설치가 가능하다는 점이다.
4. 그래서 Dockerfile에서 backend만 설치한다고 해도, frontend의 package.json이 없으면 npm은 "선언된 워크스페이스 폴더가 비어있다"며 에러를 낸다.

```dockerfile
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/    # ← 이게 빠지면 빌드 실패
RUN npm ci -w backend
```

5. 만약 위 frontend/package.json COPY를 빼면 `npm ci` 단계에서 `No workspaces found: --workspace=frontend` 류의 에러가 떨어지면서 빌드가 멈춘다.
6. 이 에러가 처음 보면 "왜 backend만 설치하는데 frontend가 필요하지?"라는 황당함을 부르지만, 본질은 npm이 lockfile을 검증할 때 모든 워크스페이스 정의를 비교하기 때문이다.
7. 즉 lockfile에 적힌 의존성 트리가 현재 워크스페이스 구성과 일치하는지를 npm이 확인하는데, frontend 폴더가 비어있으면 "선언된 워크스페이스가 사라진 비정상 상태"로 판단해서 멈춘다.
8. 반대로 `frontend/package.json` 한 파일만 있으면 그 안에 적힌 메타데이터로 충분히 검증을 통과하므로, frontend의 소스코드는 굳이 복사할 필요가 없다는 점이 핵심이다.
9. 이 구조는 필요한 메타데이터만 잘라 넣어 캐시 친화적이면서 워크스페이스 검증을 통과시키는 미세한 균형이고, 우리 Dockerfile 1단의 세 줄 COPY가 정확히 이 균형 위에 서 있다.

→ npm workspaces는 lockfile과 모든 워크스페이스 package.json을 한 세트로 보기 때문에, 일부만 설치할 때도 다른 워크스페이스의 package.json은 메타데이터로 함께 넣어야 한다.


## bind mount, named volume, anonymous volume 비교

1. Docker에서 "데이터를 컨테이너 바깥에 두는 방법"이 한 가지가 아니라 세 가지가 있고, 우리 `docker-compose.yml`은 이 세 가지를 모두 한 파일 안에서 사용했다.
2. 셋 모두 `volumes:` 키워드 아래에 적히는 데다 결과적으로 "컨테이너 안의 어떤 경로가 외부 저장소를 가리킨다"는 점은 같아서, 차이를 모르면 같은 기능이 단지 표기만 다른 것처럼 보인다.

```yaml
volumes:
  - ./backend:/workspace/backend           # bind mount
  - postgres_data:/var/lib/postgresql/data # named volume
  - /workspace/node_modules                # anonymous volume
```

3. bind mount는 호스트 파일시스템의 특정 경로를 컨테이너 안에 그대로 비추는 방식으로, 우리 `./backend:/workspace/backend`가 그 예다.
4. 호스트에서 파일을 수정하면 컨테이너 내부에서도 즉시 반영되기 때문에 핫 리로드 같은 개발 워크플로에 적합하지만, 호스트 OS와 컨테이너 OS가 다르면 OS-specific binary가 깨지는 문제가 있어서 `node_modules` 같은 경로엔 쓰면 안 된다.
5. named volume은 Docker가 자체적으로 관리하는 저장 공간에 이름을 붙여둔 형태로, 우리 `postgres_data`가 그 예다.
6. 호스트의 어디에 저장되는지는 Docker가 알아서 처리하고(맥에서는 Docker Desktop VM 안), 사용자는 이름으로만 다루기 때문에 `docker compose down`으로 컨테이너가 사라져도 같은 이름의 볼륨은 살아남아 다음 컨테이너가 같은 데이터에 다시 붙을 수 있다.
7. anonymous volume은 named volume과 거의 같은데 이름이 없는 형태로, 우리 `- /workspace/node_modules`가 그 예다.
8. 이름이 없어 재사용도 안 되고 대개 컨테이너가 사라지면 함께 정리되기 때문에, "이 경로의 내용은 일시적으로 격리만 시키고 싶을 뿐 다음 실행에서 이어 쓸 필요는 없다"는 의도에 맞다.
9. 셋의 본질적 차이는 이름이 있느냐와 저장 위치를 누가 결정하느냐 두 축으로 정리되고, 이 두 축이 곧 어떤 용도에 어떤 볼륨을 써야 하는가를 결정한다.
10. bind mount는 호스트가 위치를 결정하고 이름은 경로 자체이며 호스트 ↔ 컨테이너 동기화·핫 리로드용으로 쓴다.
11. named volume은 Docker가 위치를 결정하고 이름을 명시해서 DB처럼 영속이 필요한 데이터를 담는다.
12. anonymous volume은 Docker가 위치를 결정하지만 이름이 없어 재사용되지 않으며 임시 격리, 특히 bind mount의 광범위 동기화에서 일부 경로만 빼고 싶을 때 쓴다.

→ 이름의 유무와 저장 위치를 누가 결정하는가가 곧 영속성·재사용 가능성·용도를 결정한다.


## 볼륨 영속성은 어떻게 만들어지는가

1. PostgreSQL 컨테이너를 한 번 내렸다 다시 띄워도 데이터가 그대로 남아있는 이유는, 데이터가 컨테이너 바깥의 named volume에 저장되기 때문이다.
2. 이 영속성은 단일 설정으로 만들어지지 않고 `docker-compose.yml`의 두 위치가 짝을 이뤄야 작동한다.

```yaml
services:
  postgres:
    volumes:
      - postgres_data:/var/lib/postgresql/data    # ① 마운트 매핑

volumes:
  postgres_data:                                  # ② named volume 선언
```

3. ①은 "`postgres_data`라는 이름의 볼륨을 컨테이너 안 `/var/lib/postgresql/data` 경로에 마운트해라"는 지시다.
4. PostgreSQL이 모든 테이블·인덱스·WAL 로그를 쓰는 디렉토리가 정확히 이 경로(`/var/lib/postgresql/data`)이기 때문에, 이 매핑이 곧 DB의 모든 쓰기 작업이 컨테이너 외부 볼륨으로 흘러간다는 의미가 된다.
5. ②는 같은 파일 맨 아래의 top-level 선언으로, "`postgres_data`라는 named volume을 Docker가 관리하도록 등록해라"는 의미다.
6. 이 선언이 없다면 ①에서 가리키는 이름이 정의되지 않은 상태가 돼서 compose 자체가 에러를 낸다.
7. 따라서 영속성의 본질은 한 줄짜리 마법이 아니라, DB가 데이터를 쓰는 경로를 외부 볼륨으로 빼는 매핑(①)과 그 외부 볼륨을 Docker가 부팅 시 만들어주는 선언(②) 두 축의 합작이다.
8. 이렇게 외부로 빠진 볼륨은 컨테이너의 라이프사이클과 분리되어 살기 때문에, `docker compose down`으로 컨테이너가 삭제돼도 볼륨은 별개의 자원으로 남아 다음 컨테이너가 같은 데이터에 다시 붙을 수 있다.
9. 우리가 실험으로 직접 확인한 흐름이 정확히 이 구조의 작동 증명이고, `INSERT`로 한 행을 넣은 뒤 `down` → `up`을 거쳐도 그 데이터가 그대로 보였던 것이 그 결과다.
10. 반대로 컨테이너에 이런 매핑 없이 그냥 데이터를 썼다면, 그 데이터는 컨테이너 이미지의 쓰기 가능 레이어에 저장되어 컨테이너가 사라지는 순간 함께 증발했을 것이다.

→ 영속성은 "DB가 쓰는 경로를 외부 볼륨으로 빼는 매핑 + 그 볼륨을 Docker에게 만들도록 알리는 선언"의 합작에서 나온다.


## backend의 익명 볼륨은 영속성이 아니라 방어용

1. 같은 `volumes:` 키워드 아래에 적혀 있어도, postgres와 backend가 쓰는 볼륨의 목적은 정반대라는 점이 흥미롭다.
2. backend 서비스에 적힌 두 줄을 보면 익명 볼륨이지만, 이 볼륨이 거기 있는 이유는 데이터를 보존하려는 게 아니다.

```yaml
backend:
  volumes:
    - ./backend:/workspace/backend     # bind mount (핫 리로드용)
    - /workspace/node_modules          # anonymous volume (방어용)
    - /workspace/backend/node_modules
```

3. 문제 상황은 첫 줄의 bind mount에서 시작되는데, `./backend`(호스트) 전체가 `/workspace/backend`(컨테이너)에 통째로 비춰진다.
4. 이때 호스트의 `backend/` 폴더에는 보통 `node_modules`가 없거나 있더라도 macOS용 바이너리고, 컨테이너 안에는 빌드 시점에 깔린 Linux용 `node_modules`가 있다.
5. bind mount는 "호스트로 컨테이너 경로를 덮어쓴다"라서 그대로 두면 컨테이너의 Linux용 `node_modules`가 호스트의 비어있는(또는 macOS용) 상태로 가려져서 모듈을 찾지 못해 앱이 못 뜬다.
6. 이 문제를 해결하기 위해 익명 볼륨으로 그 경로 위에 다시 한 번 덮어씌워, 이 경로만큼은 호스트가 아니라 컨테이너 내부 상태를 유지하라고 지정하는 것이 두 번째·세 번째 줄이다.
7. 즉 익명 볼륨이 마치 보호막처럼 작용해서, bind mount의 광범위한 동기화 범위에서 `node_modules` 부분만 제외시키는 효과를 만든다.
8. 같은 문법이지만 postgres의 `postgres_data`와는 의도가 달라서, 우리는 이 볼륨이 다음 실행에 다시 붙어주길 기대하지 않는다.
9. 이름이 없으니 재사용도 안 되지만, 어차피 다음 빌드 때 새로 깔리면 되는 데이터라 사라져도 무해하다.
10. 한 파일에 같은 키워드의 정반대 용법이 공존한다는 사실은 처음에 헷갈리지만, 한 번 인식하고 나면 이름의 유무가 곧 영속이냐 일회성이냐의 의도를 고스란히 드러낸다는 점에서 Docker 볼륨 시스템의 일관성이 보인다.

→ backend의 익명 볼륨은 데이터를 남기려는 게 아니라 bind mount가 컨테이너 내부 상태를 덮어쓰는 걸 막기 위한 방어 장치다.


## compose 자동 네트워크와 서비스명 DNS

1. backend 컨테이너에서 postgres 컨테이너로 접속할 때 "어떤 호스트명을 써야 하는가"라는 질문은 처음 보면 막막한데, 그 답은 compose가 자동으로 만들어주는 네트워크 구조에서 나온다.
2. `docker compose up`을 실행하면 compose는 자동으로 이 프로젝트 전용 가상 네트워크 한 개를 만들고, 같은 파일에 정의된 모든 서비스를 그 네트워크에 연결한다.
3. 이 네트워크 안에서는 각 컨테이너가 자기 서비스명을 그대로 호스트명으로 갖게 되고, Docker 내장 DNS가 그 이름을 자동으로 해당 컨테이너의 IP로 풀어준다.
4. 그래서 backend 코드에서 PostgreSQL에 접속하려면 단순히 `host=postgres`라고만 적으면 되지 IP를 알 필요가 없다.
5. 같은 이름이 호스트(맥)에서는 안 통한다는 점이 함정인데, 호스트 입장에선 그 가상 네트워크에 속하지 않으므로 `localhost:5432`로 포트 매핑된 게이트웨이를 통해 접속해야 한다.

```
[Mac 호스트]
   ↓ localhost:5432 (포트 매핑)
[compose 자동 네트워크]
   ├─ backend  ── host=postgres ──→ postgres
   └─ postgres
```

6. 이 두 경로가 다르다는 건 어디서 접속하느냐가 곧 어떤 주소를 써야 하는가를 결정한다는 의미고, 디버깅 도구(예: TablePlus)에서 접속할 땐 호스트 입장이라 `localhost:5432`, NestJS 코드 안에서 접속할 땐 컨테이너 입장이라 `postgres:5432`로 구분해야 한다.
7. 자동으로 만들어진 네트워크 이름은 보통 `<프로젝트명>_default` 형태이고, `docker network ls`로 확인할 수 있다.
8. 이 자동 네트워킹 덕에 우리는 IP 관리·서비스 디스커버리 같은 부수 작업 없이 서비스명만 알아도 컨테이너 간 통신이 되는 환경을 무료로 얻었고, 이게 compose가 멀티 컨테이너 개발에 적합한 이유 중 하나다.

→ compose는 프로젝트 단위 가상 네트워크를 자동으로 만들어주고 서비스명이 곧 호스트명이 되어, 컨테이너끼리는 IP 없이 이름만으로 통신할 수 있다.


## healthcheck와 depends_on.condition으로 race condition 막기

1. 멀티 컨테이너 환경에서 흔한 문제 하나가 DB가 미처 준비되기 전에 앱이 먼저 떠서 첫 연결이 거부되는 경주 조건(race condition)이고, 이걸 막는 게 우리 compose의 healthcheck 블록이다.
2. 가장 단순한 의존성 표현은 `depends_on: [postgres]`인데, 이건 postgres 컨테이너의 프로세스가 시작될 때까지만 기다린다.
3. 문제는 PostgreSQL 프로세스가 떴다고 해서 곧장 연결을 받을 준비가 된 건 아니라는 점이고, 내부 초기화·캐시 로딩이 끝나기까지 1~수 초의 공백이 있다.
4. 이 공백 동안에 backend가 먼저 떠서 DB 연결을 시도하면 connection refused가 떨어지면서 backend가 죽거나 재시도 루프에 빠진다.
5. 이걸 깔끔하게 막으려면 프로세스 기동이 아니라 접속 가능한 상태를 기다리도록 의존성 조건을 바꿔야 하고, 그게 healthcheck와 `condition: service_healthy` 조합이다.

```yaml
postgres:
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
    interval: 5s
    timeout: 3s
    retries: 10

backend:
  depends_on:
    postgres:
      condition: service_healthy
```

6. `pg_isready`는 postgres가 지금 접속 받을 준비가 됐는지만 초경량으로 확인해주는 빌트인 도구라서 healthcheck 명령으로 가장 흔히 쓰인다.
7. compose는 5초 간격으로 이 명령을 돌려서 성공하면 그 컨테이너의 상태를 `(healthy)`로 표시하고, 이 상태가 되어야만 backend의 시작이 트리거된다.
8. 우리가 `docker compose ps` 결과에서 `Up 25 seconds (healthy)`라는 표시를 본 게 정확히 이 healthcheck가 작동했다는 증거고, 그 시점부터 backend가 뜨기 시작하니 첫 연결이 안전하게 성공한다.
9. 즉 단순 `depends_on`은 프로세스 ON/OFF 수준의 의존성, healthcheck와 condition 조합은 진짜 사용 가능한가 수준의 의존성이라는 차이가 있고, DB·메시지 큐처럼 내부 초기화가 필요한 서비스 앞엔 늘 후자를 두는 게 정석이다.

→ 단순 depends_on은 프로세스 기동만 보장하지만, healthcheck와 service_healthy 조건을 더하면 실제 접속 가능 시점까지 기다려서 race condition을 막는다.


## 포트 매핑 좌우와 .env 자동 로드

1. compose 파일을 처음 보면 작은 디테일에서 막히기 쉬운데, 포트 매핑의 좌·우가 그중 하나다.

```yaml
backend:
  ports:
    - '4000:4000'   # 호스트:컨테이너
```

2. 좌측이 호스트 측 포트, 우측이 컨테이너 내부 포트라는 규칙이 있고, 이 둘은 독립적이라 좌측만 바꿔도 컨테이너 안의 앱은 그대로 4000번을 듣는다.
3. 예컨대 `'14000:4000'`로 바꾸면 호스트에서는 `localhost:14000`로 접속하지만 컨테이너 내부 NestJS는 여전히 `0.0.0.0:4000`을 리스닝한다.
4. 이 분리가 중요한 이유는 호스트의 4000번이 다른 프로세스에 점유돼 있을 때 좌측만 살짝 바꿔서 충돌을 피할 수 있고, 컨테이너 내부 설정은 건드리지 않아도 되기 때문이다.
5. 한편 같은 compose 파일에 보이는 또 하나의 작은 마법이 .env 자동 로드인데, postgres의 `${POSTGRES_USER}` 같은 표현이 어디서 채워지는지가 처음 보면 불명확하다.

```yaml
postgres:
  environment:
    POSTGRES_USER: ${POSTGRES_USER}
```

6. compose는 실행 시 `docker-compose.yml`과 같은 폴더에 있는 `.env` 파일을 자동으로 읽어들이고, 그 안의 KEY=VALUE 쌍을 `${KEY}` 자리에 보간(interpolation)한다.
7. 그래서 `.env`에 `POSTGRES_USER=app`이 적혀 있으면 compose가 그 값을 가져와 컨테이너의 환경변수로 전달하는 흐름이 자동으로 만들어진다.
8. 이 자동 로드는 편리하지만 보안상 함정이 있는데, 비밀이 담긴 `.env`가 실수로 커밋되면 그대로 노출되므로 우리는 `.gitignore`로 `.env*`를 제외하고 `.env.example`만 커밋하는 표준 패턴을 따랐다.
9. 두 디테일 모두 compose가 호스트 환경과 컨테이너 환경을 잇는 다리라는 공통점을 갖고, 이 다리가 어디서 어떻게 놓이는지를 한 번 이해해두면 향후 다른 서비스를 추가할 때도 같은 패턴이 그대로 적용된다.

→ 포트 매핑은 좌(호스트):우(컨테이너)로 독립이고, compose 옆 .env는 자동 로드돼 `${KEY}` 자리에 보간된다.


## down과 down -v의 차이

1. `docker compose` 명령어는 비슷해 보이는 형태가 여럿이라 어떤 명령이 어떤 자원을 지우고 남기는지 헷갈리기 쉽다.
2. 이걸 정리해두지 않으면 "내가 의도한 것보다 더 많은 게 사라졌다" 또는 "왜 컨테이너 다시 띄웠는데 옛날 데이터가 그대로 있지?" 같은 의문이 따라붙는다.
3. 우리가 실험한 세 명령은 컨테이너·네트워크·named volume·이미지에 대해 각각 다르게 작동한다.
4. `docker compose stop`은 컨테이너 프로세스를 멈추기만 하고 컨테이너·네트워크·볼륨·이미지 모두 그대로 둔다.
5. `docker compose down`은 컨테이너와 네트워크를 깨끗이 지우지만, named volume은 의도적으로 보존해서 다음 `up` 때 같은 데이터에 다시 붙을 수 있게 하고 이미지도 남긴다.
6. `docker compose down -v`는 가장 파괴적인 명령으로 컨테이너·네트워크에 더해 named volume까지 삭제해서 이 프로젝트의 모든 영속 데이터를 초기화하지만 이미지는 여전히 남는다.
7. 이미지는 어느 명령에서도 사라지지 않는데, 이미지는 다른 컨테이너에서도 공유될 수 있는 자산이고 빌드 비용이 크기 때문에 명시적으로 `docker rmi` 또는 `docker compose down --rmi all` 같은 별도 명령을 호출해야만 사라진다.
8. 우리가 실험에서 `INSERT`로 한 행을 넣고 `down` → `up`을 거쳐도 데이터가 살아남은 이유가 정확히 5번 항목이고, 그 뒤에 `down -v`를 호출하자 `docker volume ls`에 더 이상 `limjaejooncom_postgres_data`가 안 보였던 게 6번 항목의 결과다.
9. 결국 어떤 명령을 쓸지는 "내가 다음 실행 때도 이 데이터를 이어 쓸 것인가"라는 질문의 답을 따라가게 되고, 일상 개발에서는 `down`이 기본이고 DB를 의도적으로 초기화하고 싶을 때만 `-v`를 추가하는 게 안전한 습관이다.

→ stop은 잠시 멈춤, down은 컨테이너·네트워크 삭제하되 데이터 보존, down -v는 데이터까지 초기화이며 이미지는 어느 경우에도 남는다.


## 실제로 만난 함정들

1. 이론상의 구조와 별개로 실제 셋업 중에 마주친 네 가지 함정은 그 자체로 복습 가치가 있다.

2. 첫 번째 함정은 "Docker Desktop is manually paused" 에러였는데, 빌드를 시작하자마자 어떤 docker 명령도 통하지 않았고 원인은 macOS 트레이의 고래 아이콘이 일시정지 상태였기 때문이다.
3. macOS에선 Docker가 별도 VM 위에서 도는데 이 VM이 일시정지되면 어떤 docker 명령도 통하지 않으니, 다음에 비슷한 에러가 나면 가장 먼저 트레이 아이콘 상태를 확인하는 습관이 빠른 진단으로 이어진다.

4. 두 번째 함정은 호스트 4000 포트 점유였는데, `docker compose up` 단계에서 `Bind for 0.0.0.0:4000 failed: port is already allocated` 에러가 났다.
5. 원인은 호스트에서 이미 NestJS 개발 서버가 4000번을 점유하고 있었던 것이고, `lsof -ti :4000`로 PID를 찾아 `kill`로 정리해서 풀었다.
6. 이 함정의 교훈은 포트 매핑의 좌측은 호스트 자원이고 호스트의 다른 프로세스와 충돌 가능하다는 점인데, 좌측만 다른 포트로 바꿔도 회피할 수 있어 충돌 시 두 가지 선택지가 있다는 걸 기억해두면 좋다.

7. 세 번째 함정은 `Error EBUSY: resource busy or locked, rmdir '/workspace/backend/dist'` 에러로 backend 컨테이너 시작 직후 watch가 죽은 사건이다.
8. 원인 추적이 까다로웠는데, NestJS의 `nest-cli.json`에 `deleteOutDir: true` 옵션이 있어서 watch가 시작 전에 dist 폴더를 통째로 지우려 했고, 우리가 `dist`를 익명 볼륨으로 마운트해두니 마운트 포인트는 OS 차원에서 삭제가 불가능해 충돌이 난 것이다.
9. 해결은 단순했는데 dist에 대한 익명 볼륨을 compose에서 빼는 것이고, 어차피 `.dockerignore`/`.gitignore`로 dist가 빠져있어 호스트로 새어나가도 무해하므로 격리 자체가 불필요했다.
10. 일반화하면 도구가 디렉토리를 통째로 삭제·재생성하는 동작과 그 디렉토리에 마운트가 걸린 상태는 충돌한다는 패턴이고, watch·번들러처럼 출력 폴더를 청소하는 도구를 만나면 같은 함정을 의심해야 한다.

11. 네 번째 함정은 env 파일 작성을 hook이 막은 사건인데, `.env`와 `.env.example` 파일을 Claude가 작성하려 하자 프로젝트의 `block-protected-files.sh` 훅이 차단했다.
12. 이는 비밀 정보가 섞일 수 있는 파일은 의도적으로 사람의 손을 거치게 하려는 프로젝트 정책의 결과로, AI에게 자동 작성을 맡기지 않는 안전 장치다.
13. 그래서 파일 내용을 대화에 제시하고 사용자가 직접 만드는 형태로 우회했고, 이는 도구가 막혔다고 정책 자체를 우회할 게 아니라 정책의 의도를 따라 흐름을 조정하는 게 옳다는 작은 사례다.

→ 실제 셋업에선 VM 일시정지·호스트 포트 충돌·마운트 포인트와 폴더 삭제 충돌·정책 훅 차단 같은 환경발 함정이 자주 등장하므로, 에러 메시지를 단서로 환경 쪽도 함께 의심해야 한다.

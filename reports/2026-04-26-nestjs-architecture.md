# NestJS 기본 아키텍처 (모듈 · 컨트롤러 · 서비스 · DI)

## NestJS가 등장한 맥락

1. Node 진영의 사실상 표준이었던 Express는 라우터에 함수만 등록하면 동작하는 자유로운 프레임워크라서, 작은 프로젝트에는 빠르지만 코드가 늘어나면 같은 일을 하는 라우터가 폴더마다 다른 모양으로 흩어지는 문제가 생겼다.
2. 이 문제는 "어디에 무엇을 두느냐"를 팀이 합의해야 풀리는데, 합의가 코드로 강제되지 않으면 시간이 지나면서 또 깨진다.
3. NestJS는 이 합의를 프레임워크 차원에서 강제하기 위해 Angular의 모듈/의존성 주입(DI) 모델을 백엔드로 옮겨온 것이며, 그래서 "구조의 강제"가 곧 NestJS의 정체성이다.
4. 즉 Express는 라우터 등록 도구이고, NestJS는 라우터를 포함한 애플리케이션 전체를 모듈 그래프로 조립하는 IoC(Inversion of Control) 컨테이너다.
5. 기본은 Express를 엔진으로 깔고 그 위에 데코레이터·메타데이터·DI 시스템을 얹은 형태라서, Express 미들웨어 자산을 그대로 쓸 수 있으면서도 코드 모양은 일관된다.

## 핵심 4개 — Module · Controller · Service · Provider

1. NestJS의 모든 코드는 결국 네 가지 역할 중 하나로 분류되며, 이 분류가 곧 파일 분할의 기준이 된다.
2. Module은 "어떤 코드들이 한 묶음으로 동작하는가"를 선언하는 컨테이너이고, Controller는 HTTP 요청이 코드와 만나는 가장 바깥 경계이며, Service는 비즈니스 로직을 담는 클래스이고, Provider는 DI 컨테이너에 등록되는 모든 것의 일반화된 이름이다.
3. 표현을 단순화하면 "Service는 Provider의 한 종류"라고 봐도 무방하고, 실제로 가장 흔한 Provider가 @Injectable()로 표시된 Service 클래스다.
4. 한 도메인의 Module은 보통 Controller 한두 개와 Service 한두 개를 한 폴더에 같이 두며, 이 묶음이 다른 모듈에서 필요해지면 exports로 외부에 노출시킨다.
5. 파일 트리로 보면 도메인 단위 응집을 곧바로 디렉토리 구조로 표현하는 것이 NestJS의 기본 패턴이다.

```
backend/src/
  users/
    users.module.ts
    users.controller.ts
    users.service.ts
    user.entity.ts
  auth/
    auth.module.ts
    auth.controller.ts
    auth.service.ts
  app.module.ts        # 모든 모듈을 모으는 루트
  main.ts              # 부트스트랩 진입점
```

## Module — 응집된 한 묶음

1. Module은 @Module 데코레이터로 메타데이터(어떤 모듈을 import할지, 어떤 Controller·Provider를 가질지, 어떤 것을 외부로 export할지)를 선언하는 클래스다.
2. 가장 단순한 Module은 도메인 하나의 Service와 Controller를 묶는 형태이고, 다른 모듈에서 그 Service를 쓰고 싶으면 exports에 명시한다.

```ts
@Module({
  imports: [],                  // 의존하는 다른 모듈
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],      // AuthModule에서 UsersService를 쓰기 위해
})
export class UsersModule {}
```

3. exports에 안 올린 Provider는 그 모듈 안에서만 보이며, 이 캡슐화가 도메인 경계를 코드로 강제하는 핵심 장치다.
4. 한 Provider가 어디서든 자유롭게 보이게 만들고 싶다면 @Global() 데코레이터를 모듈에 붙여 전역으로 등록하지만, 남용하면 모듈 경계가 무너지므로 인프라성 모듈(예: ConfigModule)에만 쓴다.
5. NestJS의 부팅은 루트 Module(AppModule)에서 시작해 import 그래프를 따라 내려가며 모든 Provider를 찾아 인스턴스화하는 과정이다.

## Controller — HTTP 엣지

1. Controller는 외부에서 들어온 HTTP 요청이 우리 코드와 처음 만나는 곳이며, 라우팅·요청 파싱·응답 직렬화를 담당한다.
2. 데코레이터(@Controller, @Get, @Post 등)가 라우팅 메타데이터를 선언적으로 표시하고, 함수 시그니처에 @Body·@Param·@Query 같은 파라미터 데코레이터로 입력을 꺼낸다.

```ts
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
```

3. Controller에는 비즈니스 로직을 두지 않고 Service로 위임하는 게 컨벤션이며, 이 분리가 깨지면 컨트롤러 테스트가 곧 비즈니스 로직 테스트가 되어 단위 테스트의 의미가 흐려진다.
4. 입력 검증은 ValidationPipe + class-validator로 DTO 클래스에 데코레이터를 붙여 선언적으로 처리하므로, Controller 본문은 깔끔하게 유지된다.
5. 응답은 함수 반환값을 NestJS가 자동으로 JSON으로 직렬화하며, 쿠키처럼 부수효과가 필요할 때만 @Res({ passthrough: true })로 Express Response 객체에 접근한다.

## Service / Provider — 비즈니스 로직과 DI

1. Service는 @Injectable() 데코레이터가 붙은 클래스이며, 이 데코레이터가 NestJS의 DI 컨테이너에 "이 클래스를 관리 대상에 등록한다"는 신호를 준다.
2. Service의 생성자 매개변수에 다른 Service를 적으면 NestJS가 부팅 시점에 그 의존성을 자동으로 찾아 넣어주는데, 이것이 "의존성 주입"의 실체다.

```ts
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,   // DI로 자동 주입
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    // ... 비즈니스 로직
  }
}
```

3. Service가 다른 Service를 직접 new로 생성하지 않는 이유는 두 가지인데, 첫째는 단일 인스턴스(싱글턴) 보장이고 둘째는 테스트에서 의존성을 mock으로 갈아끼울 수 있는 유연성이다.
4. 같은 토큰(보통 클래스 자체)은 NestJS가 한 번만 인스턴스화해 모든 사용처에 같은 객체를 넘기므로, Service 안에 인스턴스 변수로 상태를 보관하면 모든 요청이 그 상태를 공유하게 된다는 점을 항상 의식해야 한다.
5. 그래서 Service 안의 상태는 보통 "캐시"나 "한 번 만들어 재사용하는 자원"에 한정되고, 요청별로 달라야 하는 데이터는 매개변수로 흘려보내는 게 기본이다.

## DI 컨테이너의 부팅 흐름

1. NestJS가 시작될 때 루트 Module(AppModule)부터 모든 import를 따라 내려가며 어떤 Provider가 존재하는지 그래프를 만든다.
2. 그 다음 의존성 순서대로 인스턴스를 만드는데, A가 B를 주입받으면 B를 먼저 만들고 그 인스턴스를 A의 생성자에 넘긴다.
3. 이 과정에서 순환 의존(A가 B를 주입받고 B도 A를 주입받는 경우)이 발견되면 NestJS는 forwardRef를 요구하거나 부팅을 실패시키며, 보통 순환 의존은 도메인 경계가 잘못 그려진 신호다.
4. 부팅이 끝나면 모든 Provider 인스턴스가 메모리에 상주하며, 이후의 모든 HTTP 요청은 이미 만들어진 인스턴스들 사이를 흘러간다.
5. 즉 NestJS의 런타임 비용은 거의 전부 부팅 시점에 한 번만 발생하고, 그래서 부팅이 무거워질수록 dev 사이클이 느려지는 트레이드오프가 있다.

## 횡단 관심사 — Pipe · Guard · Interceptor · Filter

1. 인증·검증·로깅·예외 처리처럼 여러 Controller에 걸쳐 반복되는 일들은 횡단 관심사(cross-cutting concern)라고 부르며, NestJS는 이를 위해 네 가지 슬롯을 미리 마련해두었다.
2. Pipe는 요청이 Controller에 도달하기 직전에 입력값을 변환·검증하는 역할이고, 가장 흔한 예가 ValidationPipe로 DTO에 붙은 class-validator 데코레이터를 검사한다.
3. Guard는 요청이 Controller에 도달하기 전에 "통과시킬 것인가"를 판단하는 슬롯이며, 인증·인가 로직이 여기 들어간다.

```ts
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const token = req.cookies['access_token'];
    try {
      req.user = this.jwtService.verify(token);
      return true;
    } catch {
      return false;   // false면 NestJS가 401을 던진다
    }
  }
}
```

4. Interceptor는 요청·응답을 가로채 가공하는 슬롯이고 RxJS 스타일로 응답 스트림을 변환할 수 있어 로깅·캐싱·타임아웃에 자주 쓰인다.
5. Filter는 throw된 예외를 잡아 HTTP 응답으로 변환하는 슬롯이며, 도메인 예외를 일관된 응답 포맷으로 매핑하고 싶을 때 글로벌 ExceptionFilter를 등록한다.
6. 네 슬롯의 실행 순서는 "Guard → Pipe → (Controller) → Interceptor의 응답 단계 → Filter(예외 시)"이고, 이 순서를 외워두면 어디에 코드를 넣을지 헷갈리지 않는다.

## AppModule이 하는 일

1. AppModule은 모든 다른 모듈을 import해 모으는 루트이며, 인프라성 모듈(설정, DB, 캐시 등)을 가장 먼저 등록하고 그 위에 도메인 모듈(UsersModule, AuthModule 등)을 올리는 구조가 일반적이다.
2. AppModule에는 보통 Controller나 Provider를 직접 두지 않고 imports만 채우며, 그래야 "루트는 조립만, 로직은 하위 모듈에서"라는 분리가 유지된다.
3. 우리 프로젝트의 현재 app.module.ts는 Phase 1까지 들어간 상태로, 환경 변수 로드·검증과 TypeORM DB 커넥션을 등록하는 두 모듈만 들어 있다.

```ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../../.env'),
      validationSchema: envValidationSchema,
      validationOptions: { abortEarly: false, allowUnknown: true },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        type: 'postgres',
        host: cs.get<string>('POSTGRES_HOST'),
        port: cs.get<number>('POSTGRES_PORT'),
        username: cs.get<string>('POSTGRES_USER'),
        password: cs.get<string>('POSTGRES_PASSWORD'),
        database: cs.get<string>('POSTGRES_DB'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

4. forRoot는 정적 옵션 객체를 한 번에 넘기는 패턴이고, forRootAsync는 다른 Provider(여기서는 ConfigService)에 의존해 옵션을 만들어야 할 때 쓰는 패턴이라서, "환경 변수가 먼저 로드돼야 DB 옵션을 만들 수 있다"는 의존성을 표현한 것이 위 코드다.
5. isGlobal: true는 ConfigService를 모든 모듈에서 별도 import 없이 쓸 수 있게 만드는 설정이고, autoLoadEntities: true는 각 도메인 모듈이 TypeOrmModule.forFeature([Entity])로 등록한 엔티티를 별도 명시 없이 자동 수집하게 하는 설정이라서, 이후 UsersModule이나 AuthModule이 추가될 때 AppModule을 안 건드려도 된다.
6. main.ts는 NestFactory.create(AppModule)로 이 루트 모듈을 부팅해 HTTP 서버를 띄우는 한 줄 진입점이고, 글로벌 ValidationPipe·CORS·cookie-parser·Swagger 마운트가 이 파일에 모이는 게 컨벤션이다.

## 파일 분할 패턴 — 도메인 단위 응집

1. NestJS 프로젝트가 커지면 가장 먼저 깨지는 것이 폴더 구조이며, 라우터별로 흩어졌던 Express 프로젝트의 악몽이 NestJS에서도 컨벤션을 안 지키면 그대로 재현된다.
2. 가장 검증된 패턴은 도메인 단위 폴더이며, 한 폴더 안에 module·controller·service·entity·dto가 모두 모이고 외부에서는 그 module을 한 단위로 import한다.

```
backend/src/auth/
  auth.module.ts
  auth.controller.ts
  auth.service.ts
  refresh-token.service.ts
  jwt-auth.guard.ts
  cookie.config.ts
  entities/
    refresh-token.entity.ts
  dto/
    signup.dto.ts
    login.dto.ts
```

3. 이 응집의 장점은 한 도메인 변경이 다른 도메인 폴더를 안 건드리고 끝난다는 점이며, 단점은 도메인 간 공유 코드가 생겼을 때 어디에 둘지 결정해야 한다는 점이다.
4. 그 답은 보통 "공유가 두 번째로 생기기 전까지는 분리하지 않는다"는 YAGNI 원칙으로 처리하며, 세 번째 도메인이 같은 코드를 필요로 할 때 비로소 shared 폴더로 승격시킨다.
5. features/ 그룹핑은 도메인이 5개를 넘길 때 도입을 검토하는 다음 단계이며, 그 전까지는 backend/src 바로 아래 도메인 폴더 평탄 배치가 가장 단순하고 좋다.

## 한 줄 정리

1. NestJS는 Express의 자유로움이 일으키는 구조 붕괴를 막기 위해 Angular의 모듈/DI 모델을 가져온 IoC 프레임워크이다.
2. 모든 코드는 Module로 묶이고, Controller가 HTTP 엣지를 담당하며, Service가 비즈니스 로직을 가지고, DI 컨테이너가 이들을 부팅 시점에 그래프로 조립한다.
3. 횡단 관심사는 Pipe·Guard·Interceptor·Filter 네 슬롯에 분리해 두고, AppModule은 모든 모듈을 imports로 모으는 루트 조립자 역할만 한다.

→ NestJS 아키텍처는 "도메인 단위 모듈"과 "DI 컨테이너"라는 두 축으로 정리되며, 이 두 개념만 잡으면 나머지는 같은 패턴의 반복이다.

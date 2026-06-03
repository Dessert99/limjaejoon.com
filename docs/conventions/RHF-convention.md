# React Hook Form 컨벤션

### 필드 선택

- 단순 input / textarea / checkbox: `register('field')`
- 값 타입 변환, multi-select, 외부 라이브러리 연동: `Controller`

### 에러 표시

- 기본은 필드 근처에서 에러 메시지를 렌더한다.
- 반복되는 UI 패턴이 있으면 공용 `FieldError` 같은 컴포넌트로 빼도 된다.

### Mutation 통합

- 제출은 `useXxxMutation` 으로 분리
- 제출 버튼 로딩 상태는 `mutation.isPending` 매핑

### 폼 분해

- useForm 으로 폼 생성. 자식 컴포넌트에서 폼 메서드 접근이 필요하면 FormProvider {...form} 로 감싸고 자식은 useFormContext<XxxFormValues>() 로 받음. 단일 컴포넌트로 끝나면 FormProvider 생략.

### 종속 필드 초기화

- 단순 종속 필드는 트리거 필드의 `Controller` `onChange` 안에서 `setValue('dependent', initialValue)` 로 초기화한다.
- 여러 외부 상태나 비동기 값에 의존하는 복잡한 동기화는 `useEffect` 사용을 허용한다.

// 로그인 요청 바디 형태 — ValidationPipe가 plainToInstance로 인스턴스화 후 class-validator 데코레이터를 검증, 실패 시 400
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

// class를 타입+값 두 자리에 동시에 사용 — 컴파일 시점엔 타입, 런타임엔 reflect-metadata로 검증 규칙을 읽는 값
export class LoginDto {
  // @ApiProperty — Swagger 문서 자동 생성용 메타데이터(설명·예시). 검증과 무관, OpenAPI JSON에만 영향
  @ApiProperty({
    example: 'user@example.com',
    description: '등록된 이메일 주소',
  })
  // @IsEmail — class-validator의 이메일 형식 검사. message는 한국어 에러 응답에 그대로 노출
  @IsEmail({}, { message: '유효한 이메일 형식이어야 합니다' })
  // !: definite assignment assertion — strict mode에서 "생성자에서 초기화 안 했다" 에러를 끄는 표시. NestJS가 plainToInstance로 채워줌
  email!: string;

  @ApiProperty({
    example: 'SecurePass123',
    description: '비밀번호 — 최소 8자 이상',
  })
  @IsString()
  @MinLength(8, { message: '비밀번호는 8자 이상이어야 합니다' })
  password!: string;
}

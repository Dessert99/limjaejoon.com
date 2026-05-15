// 회원가입 요청 바디 — LoginDto와 규칙은 같지만 의미(가입 vs 로그인)가 달라 별도 클래스로 유지, 추후 한쪽에만 약관 동의 등이 추가될 여지를 둔다
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    example: 'user@example.com',
    description: '가입할 이메일 주소 (유니크 제약)',
  })
  // @IsEmail — RFC 5322 기반 형식만 검사. 실제 도메인 존재 여부는 검증하지 않음(SMTP 확인은 별도 흐름)
  @IsEmail({}, { message: '유효한 이메일 형식이어야 합니다' })
  email!: string;

  @ApiProperty({
    example: 'SecurePass123',
    description: '비밀번호 — 최소 8자 이상',
  })
  @IsString()
  // @MinLength(8) — bcrypt 강도와 무관한 정책 최소치. 8자 이상은 OWASP 권고 하한
  @MinLength(8, { message: '비밀번호는 8자 이상이어야 합니다' })
  password!: string;
}

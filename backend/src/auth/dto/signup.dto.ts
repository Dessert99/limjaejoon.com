import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

// 회원가입 요청 바디 — 이메일 형식과 비밀번호 최소 길이를 class-validator로 검증
export class SignupDto {
  @ApiProperty({
    example: 'user@example.com',
    description: '가입할 이메일 주소 (유니크 제약)',
  })
  @IsEmail({}, { message: '유효한 이메일 형식이어야 합니다' })
  email!: string;

  @ApiProperty({
    example: 'SecurePass123',
    description: '비밀번호 — 최소 8자 이상',
  })
  @IsString()
  @MinLength(8, { message: '비밀번호는 8자 이상이어야 합니다' })
  password!: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

// 로그인 요청 바디 — SignupDto와 동일 규칙(재사용 감지 위해 별도 파일로 유지)
export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: '등록된 이메일 주소',
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

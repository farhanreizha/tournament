import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserResponse {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  accessToken?: string;

  @ApiPropertyOptional()
  refreshToken?: string;
}

export class refreshTokenResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

// export class UserResponse {
//   email: string;
//   username: string;
//   accessToken?: string;
//   refreshToken?: string;
// }

// export class refreshTokenResponse {
//   accessToken: string;
//   refreshToken: string;
// }

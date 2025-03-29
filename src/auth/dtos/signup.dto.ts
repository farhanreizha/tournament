import { IsEmail, IsString, MinLength } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class SignUpDto {
  @ApiProperty({
    description: "Username",
    example: "JohnDoe",
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: "Email Address",
    example: "example@gmail.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Password",
    example: "secret",
    additionalProperties: {
      minLength: 8,
    },
  })
  @IsString()
  @MinLength(8)
  password: string;
}

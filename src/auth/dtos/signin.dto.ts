import { IsEmail, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class SigninDto {
  @ApiProperty({
    description: "Email Address",
    example: "example@gmail.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Password",
    example: "secret",
  })
  @IsString()
  password: string;
}

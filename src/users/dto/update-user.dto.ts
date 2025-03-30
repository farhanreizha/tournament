import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: "Email Address",
    example: "example@gmail.com",
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: "Password",
    example: "secret",
  })
  @IsOptional()
  @IsString()
  password: string;

  @ApiPropertyOptional({
    description: "Username",
    example: "John Doe",
  })
  @IsOptional()
  @IsString()
  username: string;
}

import { ApiHideProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsEmail, IsString, IsEnum } from "class-validator";

export class UserResponse {
  @ApiHideProperty()
  @IsString()
  id: string;

  @ApiPropertyOptional({
    description: "Email Address",
    example: "example@gmail.com",
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: "Username",
    example: "John Doe",
  })
  @IsString()
  username: string;

  @ApiPropertyOptional({
    enum: Role,
    example: Role.PLAYER,
  })
  @IsEnum(Role)
  role: Role;
}

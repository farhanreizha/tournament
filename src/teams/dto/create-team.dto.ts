import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTeamDto {
  @ApiProperty({
    description: "Name",
    example: "Team 1",
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

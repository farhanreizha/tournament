import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateTeamDto {
  @ApiProperty({
    description: "Name",
    example: "Team 1",
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

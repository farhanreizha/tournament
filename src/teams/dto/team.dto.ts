import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class TeamResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  creator: string;
}

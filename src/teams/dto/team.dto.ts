import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class TeamResponse {
  @ApiProperty()
  name: string;
}

export class TeamListResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  creator: string;
}

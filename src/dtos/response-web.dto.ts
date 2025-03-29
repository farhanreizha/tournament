import { ApiProperty } from "@nestjs/swagger";

export class ErrorResponse {
  @ApiProperty({ example: "string" })
  requestId: string;

  @ApiProperty({
    type: "object",
    example: {
      message: "error message",
      field: ["error message validation"],
    },
    additionalProperties: true,
  })
  errors: {
    [key: string]: string[] | { message: string };
  };
}

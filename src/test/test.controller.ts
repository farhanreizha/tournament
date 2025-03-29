import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/common/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller("api/test")
export class TestController {
  @Get()
  async test(@Req() req) {
    return {
      user: {
        name: "test",
        age: 10,
      },
      message: "success",
    };
  }
}

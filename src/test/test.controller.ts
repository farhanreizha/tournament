import { Controller, Get } from "@nestjs/common";

@Controller("test")
export class TestController {
  @Get()
  async test() {
    return {
      user: {
        name: "test",
        age: 10,
      },
      message: "success",
    };
  }
}

import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { Roles } from "src/common/decorator/role.decorator";
import { AuthGuard } from "src/common/guards/auth.guard";
import { RolesGuard } from "src/common/guards/role.guard";

@UseGuards(AuthGuard)
@Controller("api/test")
export class TestController {
  @UseGuards(RolesGuard)
  @Roles(Role.PLAYER)
  @Get("player")
  async player(@Req() req) {
    return {
      player: {
        name: "test",
        age: 10,
        team: "test",
        role: "player",
      },
    };
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get("admin")
  async admin(@Req() req) {
    return {
      user: {
        name: "test",
        age: 10,
        role: "admin",
      },
    };
  }

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

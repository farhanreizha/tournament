import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  HttpCode,
} from "@nestjs/common";
import { TeamsService } from "./teams.service";
import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { AuthGuard } from "src/common/guards/auth.guard";
import { RolesGuard } from "src/common/guards/role.guard";
import { Roles } from "src/common/decorator/role.decorator";
import { Role } from "@prisma/client";

@Controller("api/teams")
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.PLAYER, Role.ADMIN)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  async create(@Body() createTeamDto: CreateTeamDto, @Req() res) {
    const result = await this.teamsService.create(createTeamDto, res.userId);
    return result;
  }

  @Get()
  @HttpCode(200)
  async findAll() {
    return await this.teamsService.findAll();
  }

  @Get(":id")
  @HttpCode(200)
  async findOne(@Param("id") id: string) {
    return await this.teamsService.findOne(id);
  }

  @Patch(":id")
  @HttpCode(200)
  async update(@Param("id") id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return await this.teamsService.update(id, updateTeamDto);
  }

  @Delete(":id")
  @HttpCode(204)
  async remove(@Param("id") id: string) {
    return await this.teamsService.remove(id);
  }
}

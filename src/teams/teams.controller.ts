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
import { AuthGuard } from "@/common/guards/auth.guard";
import { RolesGuard } from "@/common/guards/role.guard";
import { Roles } from "@/common/decorator/role.decorator";
import { Role } from "@prisma/client";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { ErrorResponse } from "@/dtos/response-web.dto";
import { TeamResponse } from "./dto/team.dto";

@ApiBearerAuth()
@ApiNotFoundResponse({
  description: "Not Found",
  type: ErrorResponse,
})
@Controller("api/teams")
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.PLAYER, Role.ADMIN)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @ApiOperation({ summary: "Create Team" })
  @ApiCreatedResponse({
    description: "Successfully Create Team",
    example: {
      name: "string",
    },
  })
  @ApiBadRequestResponse({
    description: "Bad Request",
    type: ErrorResponse,
  })
  @Post()
  async create(
    @Body() createTeamDto: CreateTeamDto,
    @Req() res,
  ): Promise<TeamResponse> {
    const result = await this.teamsService.create(createTeamDto, res.userId);
    return result;
  }

  @ApiOperation({ summary: "List Teams" })
  @ApiOkResponse({
    description: "Successfully Get Team",
    type: [TeamResponse],
  })
  @Get()
  @HttpCode(200)
  async findAll(): Promise<TeamResponse[]> {
    return await this.teamsService.findAll();
  }

  @ApiOperation({ summary: "Get Team" })
  @ApiOkResponse({
    description: "Successfully Get Team",
    type: TeamResponse,
  })
  @Get(":id")
  @HttpCode(200)
  async findOne(@Param("id") id: string): Promise<TeamResponse> {
    return await this.teamsService.findOne(id);
  }

  @ApiOperation({ summary: "Update Team" })
  @ApiOkResponse({
    description: "Successfully Update Team",
    type: TeamResponse,
  })
  @ApiBadRequestResponse({
    description: "Bad Request",
    type: ErrorResponse,
  })
  @Patch(":id")
  @HttpCode(200)
  async update(
    @Param("id") id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ): Promise<TeamResponse> {
    return await this.teamsService.update(id, updateTeamDto);
  }

  @ApiOperation({ summary: "Delete Team" })
  @ApiNoContentResponse()
  @Delete(":id")
  @HttpCode(204)
  async remove(@Param("id") id: string) {
    return await this.teamsService.remove(id);
  }
}

import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "@/common/prisma.service";
import { TeamResource } from "./resources/team.resource";

@Injectable()
export class TeamsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly prismaService: PrismaService,
    private readonly teamResource: TeamResource,
  ) {}

  private readonly teamSelect = {
    id: true,
    name: true,
    creator: {
      select: {
        username: true,
      },
    },
  };

  async create(createTeamDto: CreateTeamDto, userId: string) {
    this.logger.debug(`Create team ${JSON.stringify(createTeamDto)}`);
    const { name } = createTeamDto;

    const team = await this.prismaService.team.create({
      data: {
        name,
        userId,
      },
      select: this.teamSelect,
    });

    return this.teamResource.toJSON(team);
  }

  async findAll() {
    this.logger.debug(`Find teams`);
    const teams = await this.prismaService.team.findMany({
      select: this.teamSelect,
    });

    if (teams.length === 0) throw new NotFoundException("Teams Not Found");
    return teams.map(team => this.teamResource.toJSON(team));
  }

  async findOne(id: string) {
    this.logger.debug("find team");

    const team = await this.prismaService.team.findFirst({
      where: {
        id,
      },
      select: this.teamSelect,
    });

    if (!team) throw new NotFoundException("Team not found");
    return this.teamResource.toJSON(team);
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    this.logger.debug("update team");
    const team = await this.prismaService.team
      .update({
        where: {
          id,
        },
        data: updateTeamDto,
        select: this.teamSelect,
      })
      .catch(() => {
        throw new NotFoundException("Team not found");
      });

    return this.teamResource.toJSON(team);
  }

  async remove(id: string) {
    this.logger.debug(`Attempting to delete team with id: ${id}`);

    await this.prismaService.team
      .delete({
        where: {
          id,
        },
      })
      .catch(() => {
        throw new NotFoundException("Team not found");
      });

    return;
  }
}

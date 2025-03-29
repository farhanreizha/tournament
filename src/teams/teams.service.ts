import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "@/common/prisma.service";

@Injectable()
export class TeamsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async create(createTeamDto: CreateTeamDto, userId: string) {
    this.logger.debug(`Create team ${JSON.stringify(createTeamDto)}`);
    const { name } = createTeamDto;

    const team = await this.prismaService.team.create({
      data: {
        name,
        userId,
      },
    });

    return {
      name: team.name,
    };
  }

  async findAll() {
    this.logger.debug(`Find teams`);
    const teams = await this.prismaService.team.findMany({
      select: {
        id: true,
        name: true,
        creator: {
          select: {
            username: true,
          },
        },
      },
    });

    if (teams.length === 0) throw new NotFoundException("Teams Not Found");

    return teams.map(team => ({
      id: team.id,
      name: team.name,
      creator: team.creator.username,
    }));
  }

  async findOne(id: string) {
    this.logger.debug("find team");

    const team = await this.prismaService.team.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        creator: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!team) throw new NotFoundException("Team not found");

    return {
      id: team.id,
      name: team.name,
      creator: team.creator.username,
    };
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    this.logger.debug("update team");
    console.log(updateTeamDto);
    const team = await this.prismaService.team
      .update({
        where: {
          id,
        },
        data: updateTeamDto,
        select: {
          name: true,
          id: true,
          creator: {
            select: {
              username: true,
            },
          },
        },
      })
      .catch(() => {
        throw new NotFoundException("Team not found");
      });

    return {
      id: team.id,
      name: team.name,
      creator: team.creator.username,
    };
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

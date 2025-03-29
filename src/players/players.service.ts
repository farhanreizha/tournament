import { Inject, Injectable } from "@nestjs/common";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { UpdatePlayerDto } from "./dto/update-player.dto";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { PrismaService } from "src/common/prisma.service";

@Injectable()
export class PlayersService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  create(createPlayerDto: CreatePlayerDto) {
    this.logger.debug(`Create Player ${JSON.stringify(createPlayerDto)}`);

    let { teamId, gameId, nickname } = createPlayerDto;

    return {};
  }

  findAll() {
    return `This action returns all players`;
  }

  findOne(id: number) {
    return `This action returns a #${id} player`;
  }

  update(id: number, updatePlayerDto: UpdatePlayerDto) {
    return `This action updates a #${id} player`;
  }

  remove(id: number) {
    return `This action removes a #${id} player`;
  }
}

import { Module } from "@nestjs/common";
import { TeamsService } from "./teams.service";
import { TeamsController } from "./teams.controller";
import { TeamResource } from "./resources/team.resource";

@Module({
  controllers: [TeamsController],
  providers: [TeamsService, TeamResource],
})
export class TeamsModule {}

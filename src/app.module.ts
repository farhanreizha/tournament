import { AuthModule } from "./auth/auth.module";
import { CommonModule } from "./common/common.module";
import { Module } from "@nestjs/common";
import { PlayersModule } from "./players/players.module";
import { TeamsModule } from "./teams/teams.module";
import { UsersModule } from './users/users.module';

@Module({
  imports: [CommonModule, AuthModule, PlayersModule, TeamsModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

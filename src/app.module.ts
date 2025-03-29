import { AuthModule } from "./auth/auth.module";
import { CommonModule } from "./common/common.module";
import { Module } from "@nestjs/common";
import { TestModule } from "./test/test.module";
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [CommonModule, TestModule, AuthModule, PlayersModule, TeamsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

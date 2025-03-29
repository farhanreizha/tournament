import { AuthModule } from "./auth/auth.module";
import { CommonModule } from "./common/common.module";
import { Module } from "@nestjs/common";
import { TestModule } from "./test/test.module";

@Module({
  imports: [CommonModule, TestModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

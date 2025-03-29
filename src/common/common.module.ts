import * as winston from "winston";

import { ConfigModule, ConfigService } from "@nestjs/config";
import { Global, Module } from "@nestjs/common";

import { JwtModule } from "@nestjs/jwt";
// import { DecoratorController } from './decorator.controller';
import { PrismaService } from "./prisma.service";
import { ValidationService } from "./validation.service";
import { WinstonModule } from "nest-winston";
import config from "src/common/config/config";

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService) => ({
        secret: configService.get("jwt.secret"),
        signOptions: { expiresIn: configService.get("jwt.expiresIn") },
      }),
      global: true,
      inject: [ConfigService],
    }),
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: false,
      load: [config],
    }),
  ],
  providers: [PrismaService, ValidationService],
  exports: [PrismaService, ValidationService],
  controllers: [],
})
export class CommonModule {}

import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, string>
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super({
      log: PrismaService.getPrismaLogConfig(),
    });
  }

  private static getPrismaLogConfig(): Prisma.LogDefinition[] {
    return [
      { emit: "event", level: "info" },
      { emit: "event", level: "warn" },
      { emit: "event", level: "error" },
      { emit: "event", level: "query" },
    ];
  }

  private setupLogging(): void {
    const logLevels: Array<keyof Logger> = [
      "info",
      "warn",
      "error",
      "info",
    ] as const;
    const prismaEvents: Prisma.LogLevel[] = ["info", "warn", "error", "query"];

    prismaEvents.forEach((event, index) => {
      this.$on(event, (e: Prisma.QueryEvent | Prisma.LogEvent) => {
        (this.logger[logLevels[index]] as (message: any) => void)(e);
      });
    });
  }

  async onModuleInit(): Promise<void> {
    this.setupLogging();
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}

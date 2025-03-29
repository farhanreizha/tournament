import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { SignUpDto } from "./dtos/signup.dto";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "@/common/prisma.service";
import * as bcrypt from "bcrypt";
import { SigninDto } from "./dtos/signin.dto";
import { JwtService } from "@nestjs/jwt";
import { v4 as uuidv4 } from "uuid";
import { RefreshTokenDto } from "./dtos/refresh-token.dto";

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private JwtService: JwtService,
  ) {}

  async signup(body: SignUpDto) {
    this.logger.debug(`Register new user ${JSON.stringify(body)}`);

    let { email, username } = body;

    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: { OR: [{ email }, { username }] },
    });

    if (totalUserWithSameUsername != 0) {
      throw new BadRequestException("Username / Email already exists");
    }

    body.password = await bcrypt.hash(body.password, 10);

    const user = await this.prismaService.user.create({
      data: body,
    });

    return {
      email: user.email,
      username: user.username,
    };
  }

  async signin(body: SigninDto) {
    this.logger.debug(`Login user ${JSON.stringify(body)}`);
    const { email, password } = body;

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException("Username or password is invalid");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Username or password is invalid");
    }

    const token = await this.generateToken(user.id);

    return {
      email: user.email,
      username: user.username,
      ...token,
    };
  }

  public async refreshToken(body: RefreshTokenDto) {
    const { refreshToken } = body;

    const oldToken = await this.prismaService.refreshToken.findFirst({
      where: {
        token: refreshToken,
        expiryDate: { gte: new Date() },
      },
    });

    if (!oldToken) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const newToken = await this.prismaService.$transaction(async prisma => {
      const token = await this.generateToken(oldToken.userId);
      await prisma.refreshToken.delete({
        where: { token: oldToken.token },
      });
      return token;
    });

    return newToken;
  }

  async generateToken(userId: string) {
    const { role } = (await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })) as { role: string };

    const accessToken = this.JwtService.sign({ userId, role });
    const refreshToken = uuidv4();

    await this.storeRefreshToken(userId, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async storeRefreshToken(userId: string, refreshToken: string) {
    // Set the refresh token expiry date to 1 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);

    await this.prismaService.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiryDate,
      },
    });
  }
}

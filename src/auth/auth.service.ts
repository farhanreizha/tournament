import { HttpException, Inject, Injectable, Logger } from "@nestjs/common";
import { SignUpDto } from "./dtos/signup.dto";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "src/common/prisma.service";
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
      throw new HttpException("Username / Email already exists", 400);
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
      throw new HttpException("Username or password is invalid", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException("Username or password is invalid", 401);
    }

    const token = await this.generateToken(user.id);

    return {
      ...token,
      email: user.email,
      username: user.username,
    };
  }

  public async refreshToken(body: RefreshTokenDto) {
    const { refreshToken } = body;

    // TODO: Implement refresh token logic, and delete old token
    const token = await this.prismaService.refreshToken.findFirst({
      where: {
        token: refreshToken,
        expiryDate: {
          gte: new Date(),
        },
      },
    });

    if (!token) {
      throw new HttpException("Invalid refresh token", 401);
    }

    return this.generateToken(token.userId);
  }

  async generateToken(userId) {
    const accessToken = this.JwtService.sign({ userId });
    const refreshToken = uuidv4();

    await this.storeRefreshToken(userId, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async storeRefreshToken(userId, refreshToken) {
    // Set the refresh token expiry date to 7 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    await this.prismaService.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiryDate,
      },
    });
  }
}

import { AuthService } from "./auth.service";
import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { SignUpDto } from "./dtos/signup.dto";
import { refreshTokenResponse, UserResponse } from "./dtos/user.dto";
import { SigninDto } from "./dtos/signin.dto";
import { RefreshTokenDto } from "./dtos/refresh-token.dto";
import { AuthGuard } from "src/common/guards/auth.guard";

@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  @HttpCode(200)
  async signup(@Body() body: SignUpDto): Promise<UserResponse> {
    const result = await this.authService.signup(body);
    return result;
  }

  @Post("signin")
  @HttpCode(200)
  async signin(@Body() body: SigninDto): Promise<UserResponse> {
    const result = await this.authService.signin(body);
    return result;
  }

  @UseGuards(AuthGuard)
  @Post("refresh-token")
  @HttpCode(200)
  async refreshToken(
    @Body() body: RefreshTokenDto,
  ): Promise<refreshTokenResponse> {
    const result = await this.authService.refreshToken(body);
    return result;
  }
}

import { AuthService } from "./auth.service";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { SignUpDto } from "./dtos/signup.dto";
import { refreshTokenResponse, UserResponse } from "./dtos/user.dto";
import { SigninDto } from "./dtos/signin.dto";
import { RefreshTokenDto } from "./dtos/refresh-token.dto";

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

  @Post("refresh-token")
  @HttpCode(200)
  async refreshToken(
    @Body() body: RefreshTokenDto,
  ): Promise<refreshTokenResponse> {
    const result = await this.authService.refreshToken(body);
    return result;
  }
}

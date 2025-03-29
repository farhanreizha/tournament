import { AuthService } from "./auth.service";
import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { SignUpDto } from "./dtos/signup.dto";
import { refreshTokenResponse, UserResponse } from "./dtos/user.dto";
import { SigninDto } from "./dtos/signin.dto";
import { RefreshTokenDto } from "./dtos/refresh-token.dto";
import { AuthGuard } from "@/common/guards/auth.guard";

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { ErrorResponse } from "@/dtos/response-web.dto";

@ApiTags("Authentication")
@ApiBadRequestResponse({ description: "Bad Request", type: ErrorResponse })
@ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponse })
@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Signup for new user" })
  @ApiOkResponse({ description: "Successfully Register", type: UserResponse })
  @Post("signup")
  @HttpCode(200)
  async signup(@Body() body: SignUpDto): Promise<UserResponse> {
    const result = await this.authService.signup(body);
    return result;
  }

  @ApiOperation({ summary: "Signin for existing user" })
  @ApiOkResponse({ description: "Successfully Login", type: UserResponse })
  @Post("signin")
  @HttpCode(200)
  async signin(@Body() body: SigninDto): Promise<UserResponse> {
    const result = await this.authService.signin(body);
    return result;
  }

  @ApiOperation({ summary: "Refresh Token" })
  @ApiOkResponse({
    description: "Successfully Refresh Token",
    type: refreshTokenResponse,
  })
  @ApiBearerAuth()
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

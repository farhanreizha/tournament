export class UserResponse {
  email: string;
  username: string;
  accessToken?: string;
  refreshToken?: string;
}

export class refreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

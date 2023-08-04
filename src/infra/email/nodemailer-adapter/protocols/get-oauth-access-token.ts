export interface GetOauthAccessToken {
  get: (clientId: string, clientSecret: string, refreshToken: string) => Promise<{ accessToken: string }>
}

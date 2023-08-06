export interface GetOauthAccessToken {
  getToken: (clientId: string, clientSecret: string, refreshToken: string) => Promise<{ accessToken: string }>
}

export interface GetOauthAccessToken {
  get: () => Promise<{ accessToken: string }>
}

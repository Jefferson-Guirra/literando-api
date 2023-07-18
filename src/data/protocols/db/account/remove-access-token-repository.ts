export interface RemoveAccessTokenRepository {
  remove: (accessToken: string) => Promise<void>
}

export interface DestroyResetPasswordRequestToken {
  destroyToken: (accessToken: string) => Promise<void>
}

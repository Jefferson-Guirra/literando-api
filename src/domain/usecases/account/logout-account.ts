export interface AccountLogout {
  logout: (accessToken: string) => Promise<string | undefined>
}

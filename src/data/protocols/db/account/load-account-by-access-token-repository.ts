export interface accountLoginModel {
  username: string
  password: string
  email: string
  id: string
  accessToken: string
}

export interface LoadAccountByAccessTokenRepository {
  loadByAccessToken: (accessToken: string) => Promise<accountLoginModel | null>
}

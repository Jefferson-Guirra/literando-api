export interface ResetPasswordAccountModel {
  id: string
  username: string
  email: string
  password: string
  accessToken: string
}

export interface ResetPasswordAccountRepository {
  resetPassword: (email: string, password: string) => Promise<ResetPasswordAccountModel | null >
}

export interface ResetPasswordModel {
  password: string
}

export interface ResetPasswordAccount {
  resetPassword: (accessToken: string, password: string) => Promise<ResetPasswordModel | null>
}

export interface ResetPasswordRequestModel {
  id: string
  email: string
  accessToken: string
}

export interface LoadResetPasswordRequestByEmailRepository {
  loadRequestByEmail: (email: string) => Promise<ResetPasswordRequestModel | null>
}

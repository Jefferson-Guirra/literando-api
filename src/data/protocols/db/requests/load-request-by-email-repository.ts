export interface ResetPasswordRequestModel {
  id: string
  email: string
  accessToken: string
}

export interface LoadRequestByEmailRepository {
  loadRequestByEmail: (email: string) => Promise<ResetPasswordRequestModel | null>
}

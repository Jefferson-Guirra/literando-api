export interface ResetPasswordRequestModel {
  id: string
  email: string
  accessToken: string
}

export interface GetResetPasswordRequest {
  find: (email: string) => Promise<ResetPasswordRequestModel | null>
}

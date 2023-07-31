export interface ResetPasswordRequestModel {
  id: string
  email: string
  accessToken: string
}

export interface GetResetPasswordRequestRepository {
  find: (email: string) => Promise<ResetPasswordRequestModel | null>
}

import { ResetPasswordRequestModel } from './get-reset-password-request-repository'

export interface AddResetPasswordRequestRepository {
  add: (email: string, accessToken: string) => Promise<ResetPasswordRequestModel | null>
}

import { ResetPasswordRequestModel } from './get-reset-password-request-repository'

export interface UpdateResetPasswordTokenRepository {
  update: (email: string, accessToken: string) => Promise<ResetPasswordRequestModel | null>
}

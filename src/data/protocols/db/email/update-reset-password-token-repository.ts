import { ResetPasswordRequestModel } from './load-reset-password-request-by-email-repository'

export interface UpdateResetPasswordTokenRepository {
  update: (email: string, accessToken: string) => Promise<ResetPasswordRequestModel | null>
}

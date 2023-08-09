import { ResetPasswordRequestModel } from './load-reset-password-request-by-email-repository'

export interface LoadResetPasswordRequestByAccessTokenRepository {
  loadRequestByAccessToken: (accessToken: string) => Promise<ResetPasswordRequestModel | null>
}

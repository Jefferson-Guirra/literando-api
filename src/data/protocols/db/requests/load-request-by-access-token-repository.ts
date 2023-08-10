import { ResetPasswordRequestModel } from './load-reset-password-request-by-email-repository'

export interface LoadRequestByAccessTokenRepository {
  loadRequestByAccessToken: (accessToken: string) => Promise<ResetPasswordRequestModel | null>
}

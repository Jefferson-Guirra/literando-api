import { ResetPasswordRequestModel } from './load-request-by-email-repository'

export interface LoadRequestByAccessTokenRepository {
  loadRequestByAccessToken: (accessToken: string) => Promise<ResetPasswordRequestModel | null>
}

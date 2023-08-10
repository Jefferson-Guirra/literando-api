import { ResetPasswordRequestModel } from './load-request-by-email-repository'

export interface UpdateAccessTokenRequestRepository {
  update: (email: string, accessToken: string) => Promise<ResetPasswordRequestModel | null>
}

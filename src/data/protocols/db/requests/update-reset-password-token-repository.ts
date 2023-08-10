import { ResetPasswordRequestModel } from './load-request-by-email-repository'

export interface UpdateResetPasswordTokenRepository {
  update: (email: string, accessToken: string) => Promise<ResetPasswordRequestModel | null>
}

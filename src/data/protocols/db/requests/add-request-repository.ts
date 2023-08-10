import { ResetPasswordRequestModel } from './load-reset-password-request-by-email-repository'

export interface AddRequestRepository {
  add: (email: string, accessToken: string) => Promise<ResetPasswordRequestModel | null>
}

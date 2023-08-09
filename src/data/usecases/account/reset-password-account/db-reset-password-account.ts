import { ResetPasswordAccount, ResetPasswordModel } from '../../../../domain/usecases/account/reset-password-account'
import { LoadResetPasswordRequestByAccessTokenRepository } from '../../../protocols/db/email/load-reset-password-request-by-access-token-repository'

export class DbResetPasswordAccount implements ResetPasswordAccount {
  constructor (private readonly loadRequest: LoadResetPasswordRequestByAccessTokenRepository) {}
  async resetPassword (accessToken: string, password: string): Promise<ResetPasswordModel | null> {
    const request = await this.loadRequest.loadRequestByAccessToken(accessToken)
    if (!request) {
      return null
    }
    return { password: 'hashed_password' }
  }
}

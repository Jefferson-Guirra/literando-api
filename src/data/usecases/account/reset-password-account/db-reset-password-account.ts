import { ResetPasswordAccount, ResetPasswordModel } from '../../../../domain/usecases/account/reset-password-account'
import { Hasher } from '../../../protocols/criptography/hasher'
import { ResetPasswordAccountRepository } from '../../../protocols/db/account/reset-password-account-repository'
import { RemoveRequestRepository } from '../../../protocols/db/reset-password-request/remove-request-repository'
import { LoadResetPasswordRequestByAccessTokenRepository } from '../../../protocols/db/reset-password-request/load-reset-password-request-by-access-token-repository'

export class DbResetPasswordAccount implements ResetPasswordAccount {
  constructor (
    private readonly loadRequest: LoadResetPasswordRequestByAccessTokenRepository,
    private readonly hasher: Hasher,
    private readonly resetPasswordAccount: ResetPasswordAccountRepository,
    private readonly destroyRequestToken: RemoveRequestRepository
  ) {}

  async resetPassword (accessToken: string, password: string): Promise<ResetPasswordModel | null> {
    const request = await this.loadRequest.loadRequestByAccessToken(accessToken)
    if (!request) {
      return null
    }
    const { email } = request
    const hashedPassword = await this.hasher.hash(password)
    const account = await this.resetPasswordAccount.resetPassword(email, hashedPassword)
    await this.destroyRequestToken.removeRequest(accessToken)
    return account && { password: 'hashed_password' }
  }
}

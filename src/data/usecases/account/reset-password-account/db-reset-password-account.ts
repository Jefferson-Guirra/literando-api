import { ResetPasswordAccount, ResetPasswordModel } from '../../../../domain/usecases/account/reset-password-account'
import { Hasher } from '../../../protocols/criptography/hasher'
import { ResetPasswordAccountRepository } from '../../../protocols/db/account/reset-password-account-repository'
import { DestroyResetPasswordRequestToken } from '../../../protocols/db/reset-password-request/destroy-reset-passsword-token-request'
import { LoadResetPasswordRequestByAccessTokenRepository } from '../../../protocols/db/reset-password-request/load-reset-password-request-by-access-token-repository'

export class DbResetPasswordAccount implements ResetPasswordAccount {
  constructor (
    private readonly loadRequest: LoadResetPasswordRequestByAccessTokenRepository,
    private readonly hasher: Hasher,
    private readonly resetPasswordAccount: ResetPasswordAccountRepository,
    private readonly destroyRequestToken: DestroyResetPasswordRequestToken
  ) {}

  async resetPassword (accessToken: string, password: string): Promise<ResetPasswordModel | null> {
    const request = await this.loadRequest.loadRequestByAccessToken(accessToken)
    if (!request) {
      return null
    }
    const { email } = request
    const hashedPassword = await this.hasher.hash(password)
    const account = await this.resetPasswordAccount.resetPassword(email, hashedPassword)
    await this.destroyRequestToken.destroyToken(accessToken)
    return account && { password: 'hashed_password' }
  }
}

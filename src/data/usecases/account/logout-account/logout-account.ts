import { AccountLogout } from '../../../../domain/usecases/account/logout-account'
import { LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository'
import { RemoveAccessTokenRepository } from '../../../protocols/db/account/remove-access-token-repository'

export class DbLogoutAccount implements AccountLogout {
  constructor (
    private readonly loadAccountByAccessToken: LoadAccountByAccessTokenRepository,
    private readonly removeAccessToken: RemoveAccessTokenRepository
  ) {}

  async logout (accessToken: string): Promise<string | undefined> {
    const account = await this.loadAccountByAccessToken.loadByAccessToken(
      accessToken
    )
    if (!account) {
      return
    }
    await this.removeAccessToken.remove(accessToken)
    return 'logout success'
  }
}

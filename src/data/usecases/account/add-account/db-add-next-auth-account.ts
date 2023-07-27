import { NextAuthAccount } from '../../../../domain/models/account/next-auth-account'
import { AddNextAuthAccount } from '../../../../domain/usecases/account/add-next-auth-account'
import { LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository'

export class DbNextAuthAddAccount implements AddNextAuthAccount {
  constructor (private readonly loadAccount: LoadAccountByAccessTokenRepository) {}
  async add (accountModel: NextAuthAccount): Promise<NextAuthAccount | null> {
    await this.loadAccount.loadByAccessToken(accountModel.accessToken)
    return null
  }
}

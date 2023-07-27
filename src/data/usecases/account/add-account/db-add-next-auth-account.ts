import { NextAuthAccount } from '../../../../domain/models/account/next-auth-account'
import { AddNextAuthAccount, AddNextAuthAccountModel } from '../../../../domain/usecases/account/add-next-auth-account'
import { LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository'

export class DbNextAuthAddAccount implements AddNextAuthAccount {
  constructor (private readonly loadAccount: LoadAccountByAccessTokenRepository) {}
  async add (accountModel: AddNextAuthAccountModel): Promise<NextAuthAccount | null> {
    const account = await this.loadAccount.loadByAccessToken(accountModel.accessToken)
    if (account) {
      return null
    }
    return {
      email: 'any_mail@email.com',
      accessToken: 'any_token',
      password: 'hashed_password',
      username: 'any_name',
      id: 'any_id'
    }
  }
}

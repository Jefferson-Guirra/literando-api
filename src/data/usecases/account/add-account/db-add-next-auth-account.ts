import { NextAuthAccount } from '../../../../domain/models/account/next-auth-account'
import { AddNextAuthAccount, AddNextAuthAccountModel } from '../../../../domain/usecases/account/add-next-auth-account'
import { AddNextAuthAccountRepository } from '../../../protocols/db/account/add-next-auth-account-repository'
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository'
import { GenerateRandomPassword } from '../../../protocols/factories/generate-random-password'

export class DbNextAuthAddAccount implements AddNextAuthAccount {
  constructor (
    private readonly loadAccount: LoadAccountByEmailRepository,
    private readonly addAccount: AddNextAuthAccountRepository,
    private readonly randomPassword: GenerateRandomPassword
  ) {}

  async add (accountModel: AddNextAuthAccountModel): Promise<NextAuthAccount | null> {
    const account = await this.loadAccount.loadByEmail(accountModel.email)
    if (account) {
      return null
    }

    const password = this.randomPassword.generate()
    await this.addAccount.addNextAuthAccount({ ...accountModel, password })
    return {
      email: 'any_mail@email.com',
      accessToken: 'any_token',
      password: 'hashed_password',
      username: 'any_name',
      id: 'any_id'
    }
  }
}

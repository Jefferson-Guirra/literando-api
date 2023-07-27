import { NextAuthAccount } from '../../../../domain/models/account/next-auth-account'
import { AddNextAuthAccount, AddNextAuthAccountModel } from '../../../../domain/usecases/account/add-next-auth-account'
import { Hasher } from '../../../protocols/criptography/hasher'
import { AddNextAuthAccountRepository } from '../../../protocols/db/account/add-next-auth-account-repository'
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository'
import { GenerateRandomPassword } from '../../../../utils/protocols/generate-random-password'

export class DbNextAuthAddAccount implements AddNextAuthAccount {
  constructor (
    private readonly loadAccount: LoadAccountByEmailRepository,
    private readonly addAccount: AddNextAuthAccountRepository,
    private readonly randomPassword: GenerateRandomPassword,
    private readonly Hasher: Hasher
  ) {}

  async add (accountModel: AddNextAuthAccountModel): Promise<NextAuthAccount | null> {
    const account = await this.loadAccount.loadByEmail(accountModel.email)
    if (account) {
      return null
    }

    const password = this.randomPassword.generate()
    const hashedPassword = await this.Hasher.hash(password)
    const addAccount = await this.addAccount.addNextAuthAccount({ ...accountModel, password: hashedPassword })
    return addAccount
  }
}

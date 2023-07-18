import { AccountModel } from '../../../../domain/models/account/account'
import {
  AddAccount,
  AddAccountModel
} from '../../../../domain/usecases/account/add-account'
import { Hasher } from '../../../protocols/criptography/hasher'
import { AddAccountRepository } from '../../../protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository'

export class DbAddAccountRepository implements AddAccount {
  constructor (
    private readonly loadByEmail: LoadAccountByEmailRepository,
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel | null> {
    const loadAccount = await this.loadByEmail.loadByEmail(account.email)
    if (loadAccount) {
      return null
    }
    const hashedPassword = await this.hasher.hash(account.password)
    const addAccount = await this.addAccountRepository.add({
      ...account,
      password: hashedPassword
    })
    return addAccount
  }
}

import {
  Auth,
  Authentication,
  AuthenticationModel
} from '../../../../domain/usecases/account/authentication'
import { Encrypter } from '../../../protocols/criptography/encrypter'
import { HashCompare } from '../../../protocols/criptography/hash-compare'
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../../protocols/db/account/update-acess-token-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccount: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (account: AuthenticationModel): Promise<Auth | null> {
    const loadAccount = await this.loadAccount.loadByEmail(account.email)
    if (loadAccount) {
      const isValid = await this.hashCompare.compare(
        account.password,
        loadAccount.password
      )

      if (isValid) {
        const { id, username } = loadAccount
        const accessToken = await this.encrypter.encrypt(loadAccount.id)
        await this.updateAccessTokenRepository.update(id, accessToken)
        return await Promise.resolve({ accessToken, username })
      }
    }

    return null
  }
}

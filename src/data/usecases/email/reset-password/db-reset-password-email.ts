import { ResetPasswordEmail, ResetPasswordEmailModel } from '../../../../domain/usecases/email/reset-pasword-email'
import { Encrypter } from '../../../protocols/criptography/encrypter'
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository'
import { GetResetPasswordRequestRepository } from '../../../protocols/db/email/get-reset-password-request-repository'
import { UpdateResetPasswordTokenRepository } from '../../../protocols/db/email/update-reset-password-token-repository'
import { SendMessage } from '../../../protocols/email/send-message'

export class DbResetPasswordEmail implements ResetPasswordEmail {
  constructor (
    private readonly loadAccount: LoadAccountByEmailRepository,
    private readonly SendMessage: SendMessage,
    private readonly encrypter: Encrypter,
    private readonly getRequest: GetResetPasswordRequestRepository,
    private readonly updateAccessToken: UpdateResetPasswordTokenRepository

  ) {}

  async reset (email: string): Promise<ResetPasswordEmailModel | null> {
    const account = await this.loadAccount.loadByEmail(email)
    if (!account) {
      return null
    }
    const { email: emailMessage, id } = account
    const token = await this.encrypter.encrypt(id)
    const request = await this.getRequest.find(email)
    if (request) {
      await this.updateAccessToken.update(email, token)
    }
    await this.SendMessage.sendEmail(email)
    return {
      email: emailMessage,
      id
    }
  }
}

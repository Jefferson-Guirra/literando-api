import { ResetPasswordEmail, ResetPasswordEmailModel } from '../../../../domain/usecases/email/reset-pasword-email'
import { Encrypter } from '../../../protocols/criptography/encrypter'
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository'
import { GetResetPasswordRequest } from '../../../protocols/email/get-reset-password-request'
import { SendMessage } from '../../../protocols/email/send-message'

export class DbResetPasswordEmail implements ResetPasswordEmail {
  constructor (
    private readonly loadAccount: LoadAccountByEmailRepository,
    private readonly SendMessage: SendMessage,
    private readonly encrypter: Encrypter,
    private readonly getRequest: GetResetPasswordRequest

  ) {}

  async reset (email: string): Promise<ResetPasswordEmailModel | null> {
    const account = await this.loadAccount.loadByEmail(email)
    if (!account) {
      return null
    }
    const { email: emailMessage, id } = account
    await this.encrypter.encrypt(id)
    await this.getRequest.find(email)
    await this.SendMessage.sendEmail(email)
    return {
      email: emailMessage,
      id
    }
  }
}

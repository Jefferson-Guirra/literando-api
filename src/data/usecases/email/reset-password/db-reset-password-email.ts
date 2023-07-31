import { ResetPasswordEmail, ResetPasswordEmailModel } from '../../../../domain/usecases/email/reset-pasword-email'
import { Encrypter } from '../../../protocols/criptography/encrypter'
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository'
import { AddResetPasswordRequestRepository } from '../../../protocols/db/email/add-reset-password-request-repository'
import { GetResetPasswordRequestRepository } from '../../../protocols/db/email/get-reset-password-request-repository'
import { UpdateResetPasswordTokenRepository } from '../../../protocols/db/email/update-reset-password-token-repository'
import { SendResetPasswordMessage } from '../../../protocols/email/send-reset-password-message'

export class DbResetPasswordEmail implements ResetPasswordEmail {
  constructor (
    private readonly loadAccount: LoadAccountByEmailRepository,
    private readonly sendMessage: SendResetPasswordMessage,
    private readonly encrypter: Encrypter,
    private readonly getRequest: GetResetPasswordRequestRepository,
    private readonly updateAccessToken: UpdateResetPasswordTokenRepository,
    private readonly addRequest: AddResetPasswordRequestRepository

  ) {}

  async reset (email: string): Promise<ResetPasswordEmailModel | null> {
    const account = await this.loadAccount.loadByEmail(email)
    if (!account) {
      return null
    }
    const { id, username } = account
    const token = await this.encrypter.encrypt(id)
    const request = await this.getRequest.find(email)
    let accessToken = ''

    if (request) {
      const updateRequest = await this.updateAccessToken.update(email, token)

      if (updateRequest) {
        const { accessToken: token } = updateRequest
        accessToken = token
      }
    } else {
      const addREquest = await this.addRequest.add(email, token)

      if (addREquest) {
        const { accessToken: token } = addREquest
        accessToken = token
      }
    }

    await this.sendMessage.sendResetPasswordEmail(email, username, accessToken)
    return {
      id,
      email,
      accessToken
    }
  }
}

import { ResetPasswordEmail, ResetPasswordEmailModel } from '../../../../domain/usecases/email/reset-pasword-email'
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository'

export class DbResetPasswordEmail implements ResetPasswordEmail {
  constructor (private readonly loadAccount: LoadAccountByEmailRepository) {}

  async reset (email: string): Promise<ResetPasswordEmailModel | null> {
    const account = await this.loadAccount.loadByEmail(email)
    if (!account) {
      return null
    }
    return {
      email: 'any_email@mail.com',
      id: 'any_id'
    }
  }
}

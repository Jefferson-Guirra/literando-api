import { ResetPasswordEmail, ResetPasswordEmailModel } from '../../../../domain/usecases/email/reset-pasword-email'
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository'

export class DbREsetPasswordEmail implements ResetPasswordEmail {
  constructor (private readonly loadAccount: LoadAccountByEmailRepository) {}

  async reset (email: string): Promise<ResetPasswordEmailModel | null> {
    await this.loadAccount.loadByEmail(email)
    return null
  }
}

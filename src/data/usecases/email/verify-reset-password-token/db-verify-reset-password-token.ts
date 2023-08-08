import { VerifyResetPasswordToken } from '../../../../domain/usecases/email/verify-reset-password-token'
import { LoadResetPasswordRequestByAccessTokenRepository } from '../../../protocols/db/email/load-reset-password-request-by-access-token'

export class DbVerifyResetPasswordToken implements VerifyResetPasswordToken {
  constructor (private readonly loadRequest: LoadResetPasswordRequestByAccessTokenRepository) {}
  async verifyResetPasswordToken (accessToken: string): Promise<boolean> {
    await this.loadRequest.loadRequestByAccessToken(accessToken)
    return false
  }
}

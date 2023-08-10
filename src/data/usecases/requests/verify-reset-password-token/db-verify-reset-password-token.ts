import { LoadRequestByAccessTokenRepository } from '../../../protocols/db/requests/load-request-by-access-token-repository'
import { VerifyResetPasswordToken } from '../../../../domain/usecases/email/verify-reset-password-token'

export class DbVerifyResetPasswordToken implements VerifyResetPasswordToken {
  constructor (private readonly loadRequest: LoadRequestByAccessTokenRepository) {}
  async verifyResetPasswordToken (accessToken: string): Promise<boolean> {
    const request = await this.loadRequest.loadRequestByAccessToken(accessToken)
    return !!request
  }
}

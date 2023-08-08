import { VerifyResetPasswordToken } from '../../../../domain/usecases/email/verify-reset-password-token'
import { badRequest, ok } from '../../../helpers/http/http'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'

export class VerifyResetPasswordTokenController implements Controller {
  constructor (
    private readonly validator: Validation,
    private readonly verifyToken: VerifyResetPasswordToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validator.validation(httpRequest)
    if (error) {
      return badRequest(error)
    }
    const { accessToken } = httpRequest.body
    await this.verifyToken.verifyResetPasswordToken(accessToken)
    return ok('success')
  }
}

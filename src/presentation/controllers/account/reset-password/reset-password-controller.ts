import { ResetPasswordAccount } from '../../../../domain/usecases/account/reset-password-account'
import { badRequest, ok, serverError, unauthorized } from '../../../helpers/http/http'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'

export class ResetPasswordController implements Controller {
  constructor (
    private readonly validator: Validation,
    private readonly changePassword: ResetPasswordAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validation(httpRequest)
      if (error) {
        return badRequest(error)
      }
      const { accessToken, password } = httpRequest.body
      const newPassword = await this.changePassword.resetPassword(accessToken, password)
      if (!newPassword) {
        return unauthorized()
      }
      return ok({
        ok: true,
        message: 'reset password success.'
      })
    } catch (err) {
      return serverError(err as Error)
    }
  }
}

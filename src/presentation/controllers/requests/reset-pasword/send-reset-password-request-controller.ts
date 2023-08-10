import { ResetPasswordEmail } from '../../../../domain/usecases/email/reset-pasword-email'
import { badRequest, ok, serverError, unauthorized } from '../../../helpers/http/http'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'

export class SendResetPasswordRequestController implements Controller {
  constructor (
    private readonly validator: Validation,
    private readonly resetPasswordEmail: ResetPasswordEmail
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validation(httpRequest)
      if (error) {
        return badRequest(error)
      }
      const { email } = httpRequest.body
      const data = await this.resetPasswordEmail.reset(email)
      if (!data) {
        return unauthorized()
      }
      return ok(data)
    } catch (err) {
      return serverError(err as Error)
    }
  }
}

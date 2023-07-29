import { ResetPasswordEmail } from '../../../domain/usecases/email/reset-pasword-email'
import { badRequest, ok, serverError } from '../../helpers/http/http'
import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { Validation } from '../../protocols/validate'

export class ResetPasswordEmailController implements Controller {
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
      await this.resetPasswordEmail.reset(email)
      return ok('success')
    } catch (err) {
      return serverError(err as Error)
    }
  }
}

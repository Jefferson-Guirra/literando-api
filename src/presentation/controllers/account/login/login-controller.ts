import { Authentication } from '../../../../domain/usecases/account/authentication'
import {
  badRequest,
  serverError,
  unauthorized,
  ok
} from '../../../helpers/http/http'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'

export class LoginController implements Controller {
  constructor (
    private readonly validate: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validate.validation(httpRequest)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      const auth = await this.authentication.auth({ email, password })
      if (!auth) {
        return unauthorized()
      }
      const { accessToken, username } = auth
      return ok({ accessToken, username })
    } catch (err) {
      return serverError(err as Error)
    }
  }
}

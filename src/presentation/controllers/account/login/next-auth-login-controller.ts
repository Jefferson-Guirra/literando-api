import { NextAuthAuthentication } from '../../../../domain/usecases/account/next-auth-authentication'
import { badRequest, ok, unauthorized } from '../../../helpers/http/http'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'

export class NextAuthLoginController implements Controller {
  constructor (
    private readonly validator: Validation,
    private readonly authentication: NextAuthAuthentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validator.validation(httpRequest)
    if (error) {
      return badRequest(error)
    }
    const account = await this.authentication.auth(httpRequest.body)
    if (!account) {
      return unauthorized()
    }
    return ok('success')
  }
}

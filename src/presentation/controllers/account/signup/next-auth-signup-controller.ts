import { AddNextAuthAccount } from '../../../../domain/usecases/account/add-next-auth-account'
import { badRequest, ok, unauthorized } from '../../../helpers/http/http'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'

export class NexAuthSignupController implements Controller {
  constructor (
    private readonly validator: Validation,
    private readonly addAccount: AddNextAuthAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validator.validation(httpRequest)
    if (error) {
      return badRequest(error)
    }
    const { username, email, accessToken } = httpRequest.body
    const account = await this.addAccount.add({ username, email, accessToken })
    if (!account) {
      return unauthorized()
    }
    return ok('success')
  }
}

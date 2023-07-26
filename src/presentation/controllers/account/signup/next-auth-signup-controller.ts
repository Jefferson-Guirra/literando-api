import { AddNextAuthAccount } from '../../../../domain/usecases/account/add-next-auth-account'
import { badRequest, ok } from '../../../helpers/http/http'
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
    await this.addAccount.add({ username, email, accessToken })
    return ok('success')
  }
}

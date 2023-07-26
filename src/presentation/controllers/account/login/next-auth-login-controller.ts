import { badRequest, ok } from '../../../helpers/http/http'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'

export class NexAuthLoginController implements Controller {
  constructor (private readonly validator: Validation) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validator.validation(httpRequest)
    if (error) {
      return badRequest(error)
    }
    return ok('success')
  }
}

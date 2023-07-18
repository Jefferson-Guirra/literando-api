import { DeleteAllBuyBookList } from '../../../../domain/usecases/book-buy-list/delete-all-book-buy-list'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '../../../helpers/http/http'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'

export class DeleteAllBuyBooKListController implements Controller {
  constructor (
    private readonly validator: Validation,
    private readonly deleteAllBuyBooks: DeleteAllBuyBookList
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validation(httpRequest)
      if (error) {
        return badRequest(error)
      }
      const { accessToken } = httpRequest.body
      const validate = await this.deleteAllBuyBooks.deleteAllBooks(accessToken)
      if (validate === null) {
        return unauthorized()
      }
      return ok('success')
    } catch (err) {
      return serverError(err as Error)
    }
  }
}

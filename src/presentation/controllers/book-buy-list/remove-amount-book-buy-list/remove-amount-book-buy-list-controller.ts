import { RemoveAmountBuyBook } from '../../../../domain/usecases/book-buy-list/remove-amount-book-buy-list'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '../../../helpers/http/http'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'

export class RemoveAmountBuyBookListController implements Controller {
  constructor (
    private readonly validator: Validation,
    private readonly removeBookAmount: RemoveAmountBuyBook
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validation(httpRequest)
      if (error) {
        return badRequest(error)
      }
      const { accessToken, bookId } = httpRequest.body
      const removeBook = await this.removeBookAmount.removeAmount(
        accessToken,
        bookId
      )
      if (!removeBook) {
        return unauthorized()
      }
      return ok(removeBook)
    } catch (err) {
      return serverError(err as Error)
    }
  }
}

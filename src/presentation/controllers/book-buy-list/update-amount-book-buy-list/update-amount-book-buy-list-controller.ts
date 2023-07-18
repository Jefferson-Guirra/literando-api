import { UpdateAmountBuyBook } from '../../../../domain/usecases/book-buy-list/update-amount-book-buy-list'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '../../../helpers/http/http'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'

export class UpdateAmountBookBuyListController implements Controller {
  constructor (
    private readonly validator: Validation,
    private readonly updateBuyBook: UpdateAmountBuyBook
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validation(httpRequest)
      if (error) {
        return badRequest(error)
      }
      const { accessToken, bookId, amount } = httpRequest.body
      const book = await this.updateBuyBook.updateAmount(
        accessToken,
        bookId,
        amount
      )
      if (!book) {
        return unauthorized()
      }
      return ok(book)
    } catch (err) {
      return serverError(err as Error)
    }
  }
}

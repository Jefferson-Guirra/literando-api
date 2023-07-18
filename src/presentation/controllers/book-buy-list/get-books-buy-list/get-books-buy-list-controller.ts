import { GetBuyBooks } from '../../../../domain/usecases/book-buy-list/get-books-buy-list'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '../../../helpers/http/http'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'

export class GetBuyBooksController implements Controller {
  constructor (
    private readonly validator: Validation,
    private readonly getBooks: GetBuyBooks
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validation(httpRequest)
      if (error) {
        return badRequest(error)
      }
      const { accessToken } = httpRequest.body
      const books = await this.getBooks.getBuyBooks(accessToken)
      if (!books) {
        return unauthorized()
      }
      return ok(books)
    } catch (err) {
      return serverError(err as Error)
    }
  }
}

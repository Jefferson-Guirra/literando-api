import { DeleteBuyBookList } from '../../../../domain/usecases/book-buy-list/delete-book-buy-list'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '../../../helpers/http/http'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'

export class DeleteBuyBookListController implements Controller {
  constructor (
    private readonly validator: Validation,
    private readonly deleteBuyBook: DeleteBuyBookList
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validation(httpRequest)
      if (error) {
        return badRequest(error)
      }
      const { accessToken, bookId } = httpRequest.body
      const deleteBook = await this.deleteBuyBook.deleteBook(
        accessToken,
        bookId
      )
      if (!deleteBook) {
        return unauthorized()
      }
      return ok(deleteBook)
    } catch (err) {
      return serverError(err as Error)
    }
  }
}

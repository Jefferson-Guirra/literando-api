import { GetBookList } from '../../../../domain/usecases/book-list/get-book-list'
import { badRequest, ok, serverError } from '../../../helpers/http/http'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'

export class GetBookListController implements Controller {
  constructor (
    private readonly validator: Validation,
    private readonly findBook: GetBookList
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validation(httpRequest)
      if (error) {
        return badRequest(error)
      }
      const { accessToken, bookId } = httpRequest.body
      const book = await this.findBook.getBook(accessToken, bookId)
      return ok(book)
    } catch (err) {
      return serverError(err as Error)
    }
  }
}

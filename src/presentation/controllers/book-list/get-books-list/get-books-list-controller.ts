import { GetBooksList } from '../../../../domain/usecases/book-list/get-books-list'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '../../../helpers/http/http'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'

export class GetBooksListController implements Controller {
  constructor (
    private readonly validate: Validation,
    private readonly getBooksList: GetBooksList
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validate.validation(httpRequest)
      if (error) {
        return badRequest(error)
      }
      const { accessToken } = httpRequest.body
      const books = await this.getBooksList.getBooks(accessToken)
      if (books === null) {
        return unauthorized()
      }
      return await Promise.resolve(ok(books))
    } catch (err) {
      return serverError(err as Error)
    }
  }
}

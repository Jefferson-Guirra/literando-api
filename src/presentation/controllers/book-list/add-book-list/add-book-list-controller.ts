import { AddBookList } from '../../../../domain/usecases/book-list/add-book-list'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '../../../helpers/http/http'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'

export class AddBookListController implements Controller {
  constructor (
    private readonly validate: Validation,
    private readonly addBookList: AddBookList
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validate.validation(httpRequest)
      if (error) {
        return badRequest(error)
      }
      const book = await this.addBookList.add(httpRequest.body)
      if (!book) {
        return unauthorized()
      }
      return await Promise.resolve(ok(book))
    } catch (err) {
      return serverError(err as Error)
    }
  }
}

import { BookModel } from '../../../../domain/models/book/book'
import {
  AddBookList,
  AddBookModel
} from '../../../../domain/usecases/book-list/add-book-list'
import { ServerError } from '../../../../presentation/errors/server-error'
import { LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository'
import { AddBookListRepository } from '../../../protocols/db/book-list/add-book-list-repository'
import { LoadBookByQueryDocRepository } from '../../../protocols/db/book-list/load-book-list-by-query-doc'

export class DbAddBookList implements AddBookList {
  constructor (
    private readonly loadAccount: LoadAccountByAccessTokenRepository,
    private readonly addBookListRepository: AddBookListRepository,
    private readonly loadBook: LoadBookByQueryDocRepository
  ) {}

  async add (book: BookModel): Promise<AddBookModel | null> {
    const { accessToken, bookId } = book
    const account = await this.loadAccount.loadByAccessToken(accessToken)
    if (!account) {
      return null
    }

    const { id } = account
    const bookIsValid = await this.loadBook.loadBookByQuery(id, bookId)
    if (bookIsValid) {
      return bookIsValid
    }

    const addBook = await this.addBookListRepository.addBook(book, id)

    if (!addBook) {
      return await Promise.reject(new ServerError())
    }

    return addBook
  }
}

import { AddBookModel } from '../../../../domain/usecases/book-list/add-book-list'
import { GetBookList } from '../../../../domain/usecases/book-list/get-book-list'
import { LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository'
import { LoadBookByQueryDocRepository } from '../../../protocols/db/book-list/load-book-list-by-query-doc'

export class DbGetBookList implements GetBookList {
  constructor (
    private readonly loadAccount: LoadAccountByAccessTokenRepository,
    private readonly loadBook: LoadBookByQueryDocRepository
  ) {}

  async getBook (
    accessToken: string,
    bookId: string
  ): Promise<AddBookModel | null | undefined> {
    const account = await this.loadAccount.loadByAccessToken(accessToken)
    if (!account) {
      return undefined
    }

    const { id } = account
    const book = await this.loadBook.loadBookByQuery(id, bookId)
    return book
  }
}

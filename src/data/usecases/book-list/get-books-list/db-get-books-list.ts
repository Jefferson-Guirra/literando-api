import { AddBookModel } from '../../../../domain/usecases/book-list/add-book-list'
import { GetBooksList } from '../../../../domain/usecases/book-list/get-books-list'
import { LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository'
import { GetBooksListRepository } from '../../../protocols/db/book-list/get-books-list-repository'

export class DbGetBooksList implements GetBooksList {
  constructor (
    private readonly loadAccount: LoadAccountByAccessTokenRepository,
    private readonly getBooksRepository: GetBooksListRepository
  ) {}

  async getBooks (accessToken: string): Promise<AddBookModel[] | null> {
    const account = await this.loadAccount.loadByAccessToken(accessToken)
    if (!account) {
      return null
    }
    const { id } = account
    const books = await this.getBooksRepository.getBooks(id)
    return books
  }
}

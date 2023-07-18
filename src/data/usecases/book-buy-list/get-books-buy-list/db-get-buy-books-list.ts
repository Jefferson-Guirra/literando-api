import { AddBuyBookModel } from '../../../../domain/usecases/book-buy-list/add-book-buy-list'
import { GetBuyBooks } from '../../../../domain/usecases/book-buy-list/get-books-buy-list'
import { LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository'
import { GetBuyBooksRepository } from '../../../protocols/db/book-buy-list/get-books-buy-list-repository'

export class DbGetBuyBooks implements GetBuyBooks {
  constructor (
    private readonly loadAccount: LoadAccountByAccessTokenRepository,
    private readonly getBooks: GetBuyBooksRepository
  ) {}

  async getBuyBooks (accessToken: string): Promise<AddBuyBookModel[] | null> {
    const account = await this.loadAccount.loadByAccessToken(accessToken)
    if (!account) {
      return null
    }
    const { id } = account
    const books = await this.getBooks.getBuyBooks(id)
    return books
  }
}

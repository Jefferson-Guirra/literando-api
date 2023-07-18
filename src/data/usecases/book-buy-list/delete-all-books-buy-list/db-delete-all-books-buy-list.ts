import { DeleteAllBuyBookList } from '../../../../domain/usecases/book-buy-list/delete-all-book-buy-list'
import { LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository'
import { DeleteAllBuyBooksListRepository } from '../../../protocols/db/book-buy-list/delete-all-books-buy-list-repository'

export class DbDeleteAllBooksBuyList implements DeleteAllBuyBookList {
  constructor (
    private readonly loadAccount: LoadAccountByAccessTokenRepository,
    private readonly deleteAllBuyBooks: DeleteAllBuyBooksListRepository
  ) {}

  async deleteAllBooks (accessToken: string): Promise<void | null> {
    const account = await this.loadAccount.loadByAccessToken(accessToken)
    if (!account) {
      return null
    }

    const { id } = account
    await this.deleteAllBuyBooks.deleteAllBooks(id)
  }
}

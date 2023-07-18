import { AddBuyBookModel } from '../../../../domain/usecases/book-buy-list/add-book-buy-list'
import { RemoveAmountBuyBook } from '../../../../domain/usecases/book-buy-list/remove-amount-book-buy-list'
import { LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository'
import { LoadBuyBookByQueryDocRepository } from '../../../protocols/db/book-buy-list/load-book-buy-list-by-query-doc-repository'
import { RemoveAmountBuyBookRepository } from '../../../protocols/db/book-buy-list/remove-amount-book-buy-list'

export class DbRemoveAmountBookBuyList implements RemoveAmountBuyBook {
  constructor (
    private readonly loadAccount: LoadAccountByAccessTokenRepository,
    private readonly loadBook: LoadBuyBookByQueryDocRepository,
    private readonly removeAmountBookRepository: RemoveAmountBuyBookRepository
  ) {}

  async removeAmount (
    accessToken: string,
    bookId: string
  ): Promise<AddBuyBookModel | null> {
    const account = await this.loadAccount.loadByAccessToken(accessToken)
    if (!account) {
      return null
    }
    const { id } = account
    const loadBook = await this.loadBook.loadBookByQueryDoc(id, bookId)
    if (!loadBook) {
      return null
    }
    const removedBook = await this.removeAmountBookRepository.removeAmountBook(
      loadBook
    )
    return removedBook
  }
}

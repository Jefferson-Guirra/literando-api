import { AddBuyBookModel } from '../../../../domain/usecases/book-buy-list/add-book-buy-list'
import { UpdateAmountBuyBook } from '../../../../domain/usecases/book-buy-list/update-amount-book-buy-list'
import { LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository'
import { AddAmountBuyBookRepository } from '../../../protocols/db/book-buy-list/add-amount-book-buy-list-repository'
import { LoadBuyBookByQueryDocRepository } from '../../../protocols/db/book-buy-list/load-book-buy-list-by-query-doc-repository'

export class DbUpdateAmountBookBuyList implements UpdateAmountBuyBook {
  constructor (
    private readonly loadAccount: LoadAccountByAccessTokenRepository,
    private readonly loadBook: LoadBuyBookByQueryDocRepository,
    private readonly addAmountBuyBook: AddAmountBuyBookRepository
  ) {}

  async updateAmount (
    accessToken: string,
    bookId: string,
    amount: number
  ): Promise<AddBuyBookModel | null> {
    const account = await this.loadAccount.loadByAccessToken(accessToken)
    if (!account) {
      return null
    }

    const { id } = account
    const book = await this.loadBook.loadBookByQueryDoc(id, bookId)

    if (!book) {
      return null
    }

    const newBook = await this.addAmountBuyBook.addAmount(book, amount)
    return newBook
  }
}

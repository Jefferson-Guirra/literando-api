import { AddBuyBookModel } from '../../../../domain/usecases/book-buy-list/add-book-buy-list'
import { GetBookBuyList } from '../../../../domain/usecases/book-buy-list/get-book-buy-list'
import { LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository'
import { GetBookBuyListRepository } from '../../../protocols/db/book-buy-list/get-book-buy-list-repository'

export class DbGetBookBuyList implements GetBookBuyList {
  constructor (
    private readonly loadAccount: LoadAccountByAccessTokenRepository,
    private readonly getBuyBook: GetBookBuyListRepository
  ) {}

  async getBook (
    accessToken: string,
    bookId: string
  ): Promise<AddBuyBookModel | null | undefined> {
    const account = await this.loadAccount.loadByAccessToken(accessToken)
    if (!account) {
      return
    }
    const { id } = account
    const book = await this.getBuyBook.getBook(id, bookId)
    return book
  }
}

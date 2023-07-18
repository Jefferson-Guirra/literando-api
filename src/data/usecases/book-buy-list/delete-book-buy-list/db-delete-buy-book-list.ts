import { AddBuyBookModel } from '../../../../domain/usecases/book-buy-list/add-book-buy-list'
import { DeleteBuyBookList } from '../../../../domain/usecases/book-buy-list/delete-book-buy-list'
import { LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository'
import { DeleteBuyBookListRepository } from '../../../protocols/db/book-buy-list/delete-buy-book-list-repository'

export class DbDeleteBuyBookList implements DeleteBuyBookList {
  constructor (
    private readonly loadAccount: LoadAccountByAccessTokenRepository,
    private readonly deleteBuyBookRepository: DeleteBuyBookListRepository
  ) {}

  async deleteBook (
    accessToken: string,
    bookId: string
  ): Promise<AddBuyBookModel | null> {
    const account = await this.loadAccount.loadByAccessToken(accessToken)
    if (!account) {
      return null
    }
    const { id } = account
    return await this.deleteBuyBookRepository.deleteBuyBook(id, bookId)
  }
}

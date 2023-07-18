import { AddBookModel } from '../../../../domain/usecases/book-list/add-book-list'
import { RemoveBookList } from '../../../../domain/usecases/book-list/remove-book-list'
import { LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository'
import { RemoveBookListRepository } from '../../../protocols/db/book-list/remove-book-list'

export class DbRemoveBookList implements RemoveBookList {
  constructor (
    private readonly loadAccount: LoadAccountByAccessTokenRepository,
    private readonly removeBook: RemoveBookListRepository
  ) {}

  async remove (
    accessToken: string,
    idBook: string
  ): Promise<AddBookModel | null> {
    const account = await this.loadAccount.loadByAccessToken(accessToken)

    if (!account) {
      return null
    }

    const { id } = account
    const removeBook = await this.removeBook.remove(id, idBook)
    return removeBook
  }
}

import { BookModel } from '../../../../domain/models/book/book'
import {
  AddBookBuyList,
  AddBuyBookModel
} from '../../../../domain/usecases/book-buy-list/add-book-buy-list'
import { LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository'
import { AddBuyBookRepository } from '../../../protocols/db/book-buy-list/add-book-buy-list-repository'
import { LoadBuyBookByQueryDocRepository } from '../../../protocols/db/book-buy-list/load-book-buy-list-by-query-doc-repository'
import { UpdateBuyBookRepository } from '../../../protocols/db/book-buy-list/update-book-buy-list-repository'

export class DbAddBookBuyList implements AddBookBuyList {
  constructor (
    private readonly loadAccount: LoadAccountByAccessTokenRepository,
    private readonly loadBook: LoadBuyBookByQueryDocRepository,
    private readonly updateBook: UpdateBuyBookRepository,
    private readonly addBuyBook: AddBuyBookRepository
  ) {}

  async add (book: BookModel): Promise<AddBuyBookModel | null> {
    const account = await this.loadAccount.loadByAccessToken(book.accessToken)

    if (!account) {
      return null
    }
    const { id } = account
    const loadBook = await this.loadBook.loadBookByQueryDoc(id, book.bookId)
    let addBook = null
    if (loadBook) {
      addBook = await this.updateBook.updateAmount(loadBook)
    }
    if (!loadBook) {
      addBook = await this.addBuyBook.addBook(book, id)
    }

    return addBook
  }
}

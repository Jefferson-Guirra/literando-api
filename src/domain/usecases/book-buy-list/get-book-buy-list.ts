import { AddBuyBookModel } from './add-book-buy-list'

export interface GetBookBuyList {
  getBook: (
    accessToken: string,
    bookId: string
  ) => Promise<AddBuyBookModel | undefined | null>
}

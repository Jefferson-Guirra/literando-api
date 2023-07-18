import { AddBuyBookModel } from './add-book-buy-list'

export interface DeleteBuyBookList {
  deleteBook: (
    accessToken: string,
    bookId: string
  ) => Promise<AddBuyBookModel | null>
}

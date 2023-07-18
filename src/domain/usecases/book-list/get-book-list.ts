import { AddBookModel } from './add-book-list'

export interface GetBookList {
  getBook: (accessToken: string, bookId: string) => Promise<AddBookModel | null>
}

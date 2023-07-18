import { AddBookModel } from './add-book-list'

export interface GetBooksList {
  getBooks: (accessToken: string) => Promise<AddBookModel[] | null>
}

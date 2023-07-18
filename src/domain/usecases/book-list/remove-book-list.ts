import { AddBookModel } from './add-book-list'

export interface RemoveBookList {
  remove: (accessToken: string, idBook: string) => Promise<AddBookModel | null>
}

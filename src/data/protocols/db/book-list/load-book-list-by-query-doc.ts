import { AddBookModel } from '../../../../domain/usecases/book-list/add-book-list'

export interface LoadBookByQueryDocRepository {
  loadBookByQuery: (
    userId: string,
    bookId: string
  ) => Promise<AddBookModel | null>
}

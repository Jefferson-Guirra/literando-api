import { AddBookModel } from '../../../../domain/usecases/book-list/add-book-list'

export interface RemoveBookListRepository {
  remove: (userId: string, bookId: string) => Promise<AddBookModel | null>
}

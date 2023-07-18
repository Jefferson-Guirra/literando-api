import { BookModel } from '../../../../domain/models/book/book'
import { AddBookModel } from '../../../../domain/usecases/book-list/add-book-list'

export interface AddBookListRepository {
  addBook: (book: BookModel, userId: string) => Promise<AddBookModel | null>
}

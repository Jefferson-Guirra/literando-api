import { AddBookModel } from '../../../../domain/usecases/book-list/add-book-list'

export interface GetBooksListRepository {
  getBooks: (userId: string) => Promise<AddBookModel[] | null>
}

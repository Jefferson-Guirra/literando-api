import { BookModel } from '../../../../domain/models/book/book'
import { AddBuyBookModel } from '../../../../domain/usecases/book-buy-list/add-book-buy-list'

export interface AddBuyBookRepository {
  addBook: (book: BookModel, userId: string) => Promise<AddBuyBookModel | null>
}

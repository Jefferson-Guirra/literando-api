import { AddBuyBookModel } from '../../../../domain/usecases/book-buy-list/add-book-buy-list'

export interface LoadBuyBookByQueryDocRepository {
  loadBookByQueryDoc: (
    userId: string,
    bookId: string
  ) => Promise<AddBuyBookModel | null>
}

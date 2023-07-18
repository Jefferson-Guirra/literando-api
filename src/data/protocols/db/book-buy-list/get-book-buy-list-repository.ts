import { AddBuyBookModel } from '../../../../domain/usecases/book-buy-list/add-book-buy-list'

export interface GetBookBuyListRepository {
  getBook: (userId: string, bookId: string) => Promise<AddBuyBookModel | null>
}

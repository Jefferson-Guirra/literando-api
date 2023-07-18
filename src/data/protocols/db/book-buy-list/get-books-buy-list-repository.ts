import { AddBuyBookModel } from '../../../../domain/usecases/book-buy-list/add-book-buy-list'

export interface GetBuyBooksRepository {
  getBuyBooks: (userId: string) => Promise<AddBuyBookModel[] | null>
}

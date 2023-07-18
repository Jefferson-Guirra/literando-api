import { AddBuyBookModel } from '../../../../domain/usecases/book-buy-list/add-book-buy-list'

export interface RemoveAmountBuyBookRepository {
  removeAmountBook: (book: AddBuyBookModel) => Promise<AddBuyBookModel | null>
}

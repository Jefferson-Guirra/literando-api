import { AddBuyBookModel } from '../../../../domain/usecases/book-buy-list/add-book-buy-list'

export interface AddAmountBuyBookRepository {
  addAmount: (
    book: AddBuyBookModel,
    amount: number
  ) => Promise<AddBuyBookModel | null>
}

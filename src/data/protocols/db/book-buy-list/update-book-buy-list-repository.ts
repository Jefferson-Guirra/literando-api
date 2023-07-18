import { AddBuyBookModel } from '../../../../domain/usecases/book-buy-list/add-book-buy-list'

export interface UpdateBuyBookRepository {
  updateAmount: (book: AddBuyBookModel) => Promise<AddBuyBookModel | null>
}

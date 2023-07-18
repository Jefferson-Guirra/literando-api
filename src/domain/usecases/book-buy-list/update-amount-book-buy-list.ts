import { AddBuyBookModel } from './add-book-buy-list'

export interface UpdateAmountBuyBook {
  updateAmount: (
    accessToken: string,
    bookId: string,
    amount: number
  ) => Promise<AddBuyBookModel | null>
}

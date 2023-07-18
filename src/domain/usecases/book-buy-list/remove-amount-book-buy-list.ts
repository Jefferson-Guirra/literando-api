import { AddBuyBookModel } from './add-book-buy-list'

export interface RemoveAmountBuyBook {
  removeAmount: (
    accessToken: string,
    bookId: string
  ) => Promise<AddBuyBookModel | null>
}

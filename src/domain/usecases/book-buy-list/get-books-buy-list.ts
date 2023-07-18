import { AddBuyBookModel } from './add-book-buy-list'

export interface GetBuyBooks {
  getBuyBooks: (accessToken: string) => Promise<AddBuyBookModel[] | null>
}

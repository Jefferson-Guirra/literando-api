import { BookModel } from '../../models/book/book'
export interface AddBuyBookModel {
  authors: string[]
  amount: number
  pageCount: number
  date: number
  description: string
  title: string
  id: string
  imgUrl: string
  language: string
  price: number
  publisher: string
  publisherDate: string
  queryDoc: string
  bookId: string
  userId: string
}

export interface AddBookBuyList {
  add: (book: BookModel) => Promise<AddBuyBookModel | null>
}

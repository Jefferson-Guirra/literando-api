import { AddAmountBuyBookRepository } from '../../../data/protocols/db/book-buy-list/add-amount-book-buy-list-repository'
import { AddBuyBookRepository } from '../../../data/protocols/db/book-buy-list/add-book-buy-list-repository'
import { DeleteAllBuyBooksListRepository } from '../../../data/protocols/db/book-buy-list/delete-all-books-buy-list-repository'
import { DeleteBuyBookListRepository } from '../../../data/protocols/db/book-buy-list/delete-buy-book-list-repository'
import { GetBookBuyListRepository } from '../../../data/protocols/db/book-buy-list/get-book-buy-list-repository'
import { GetBuyBooksRepository } from '../../../data/protocols/db/book-buy-list/get-books-buy-list-repository'
import { LoadBuyBookByQueryDocRepository } from '../../../data/protocols/db/book-buy-list/load-book-buy-list-by-query-doc-repository'
import { RemoveAmountBuyBookRepository } from '../../../data/protocols/db/book-buy-list/remove-amount-book-buy-list'
import { UpdateBuyBookRepository } from '../../../data/protocols/db/book-buy-list/update-book-buy-list-repository'
import { BookModel } from '../../../domain/models/book/book'
import { AddBuyBookModel } from '../../../domain/usecases/book-buy-list/add-book-buy-list'
import { MongoHelper } from '../helpers/mongo-helper'

export class BuyBooksListMongoRepository
implements
    AddBuyBookRepository,
    LoadBuyBookByQueryDocRepository,
    UpdateBuyBookRepository,
    RemoveAmountBuyBookRepository,
    GetBuyBooksRepository,
    DeleteBuyBookListRepository,
    AddAmountBuyBookRepository,
    DeleteAllBuyBooksListRepository,
    GetBookBuyListRepository {
  async addBook (
    book: BookModel,
    userId: string
  ): Promise<AddBuyBookModel | null> {
    const { accessToken, bookId, ...bookFields } = book
    const buyBookCollection = await MongoHelper.getCollection('buyBooksList')
    const result = await buyBookCollection.insertOne({
      queryDoc: userId + bookId,
      userId,
      bookId,
      date: new Date().getTime(),
      amount: 1,
      ...bookFields
    })
    const addBook = await buyBookCollection.findOne({ _id: result.insertedId })
    return addBook && MongoHelper.Map(addBook)
  }

  async loadBookByQueryDoc (
    userId: string,
    bookId: string
  ): Promise<AddBuyBookModel | null> {
    const buyBooksCollection = await MongoHelper.getCollection('buyBooksList')
    const book = await buyBooksCollection.findOne({ queryDoc: userId + bookId })
    return book && MongoHelper.Map(book)
  }

  async updateAmount (book: AddBuyBookModel): Promise<AddBuyBookModel | null> {
    const { queryDoc } = book
    const buyBookCollection = await MongoHelper.getCollection('buyBooksList')
    await buyBookCollection.updateOne(
      { queryDoc: book.queryDoc },
      {
        $set: {
          amount: book.amount + 1
        }
      }
    )
    const updateAmountBook = await buyBookCollection.findOne({ queryDoc })
    return updateAmountBook && MongoHelper.Map(updateAmountBook)
  }

  async removeAmountBook (
    book: AddBuyBookModel
  ): Promise<AddBuyBookModel | null> {
    const { queryDoc } = book
    const buyBooksCollection = await MongoHelper.getCollection('buyBooksList')
    await buyBooksCollection.updateOne(
      { queryDoc },
      {
        $set: {
          amount: book.amount - 1
        }
      }
    )
    const removeBookAmount = await buyBooksCollection.findOne({ queryDoc })
    return removeBookAmount && MongoHelper.Map(removeBookAmount)
  }

  async getBuyBooks (userId: string): Promise<AddBuyBookModel[] | null> {
    const buyBooksCollection = await MongoHelper.getCollection('buyBooksList')
    const books = buyBooksCollection.find({ userId }, { sort: { date: -1 } })
    const booksFormat = await books.toArray()
    return books && booksFormat.map((book) => MongoHelper.Map(book))
  }

  async deleteBuyBook (
    userId: string,
    bookId: string
  ): Promise<AddBuyBookModel | null> {
    const buyBookCollection = await MongoHelper.getCollection('buyBooksList')
    const book = await buyBookCollection.findOne({ queryDoc: userId + bookId })
    await buyBookCollection.deleteOne({ queryDoc: userId + bookId })
    return book && MongoHelper.Map(book)
  }

  async addAmount (
    book: AddBuyBookModel,
    amount: number
  ): Promise<AddBuyBookModel | null> {
    const buyBookCollection = await MongoHelper.getCollection('buyBooksList')
    await buyBookCollection.updateOne(
      { queryDoc: book.queryDoc },
      {
        $set: {
          amount
        }
      }
    )
    const findBook = await buyBookCollection.findOne({
      queryDoc: book.queryDoc
    })
    return findBook && MongoHelper.Map(findBook)
  }

  async deleteAllBooks (userId: string): Promise<void> {
    const buyBookList = await MongoHelper.getCollection('buyBooksList')
    await buyBookList.deleteMany({ userId })
  }

  async getBook (
    userId: string,
    bookId: string
  ): Promise<AddBuyBookModel | null> {
    const buyBookCollection = await MongoHelper.getCollection('buyBooksList')
    const book = await buyBookCollection.findOne({ queryDoc: userId + bookId })
    return book && MongoHelper.Map(book)
  }
}

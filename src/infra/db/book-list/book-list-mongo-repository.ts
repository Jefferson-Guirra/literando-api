import { AddBookListRepository } from '../../../data/protocols/db/book-list/add-book-list-repository'
import { AddBookModel } from '../../../domain/usecases/book-list/add-book-list'
import { MongoHelper } from '../helpers/mongo-helper'
import { LoadBookByQueryDocRepository } from '../../../data/protocols/db/book-list/load-book-list-by-query-doc'
import { RemoveBookListRepository } from '../../../data/protocols/db/book-list/remove-book-list'
import { GetBooksListRepository } from '../../../data/protocols/db/book-list/get-books-list-repository'
import { BookModel } from '../../../domain/models/book/book'

export class BookListMongoRepository
implements
    AddBookListRepository,
    LoadBookByQueryDocRepository,
    RemoveBookListRepository,
    GetBooksListRepository {
  async addBook (book: BookModel, userId: string): Promise<AddBookModel | null> {
    const { accessToken, bookId, ...bookFields } = book
    const bookListCollection = await MongoHelper.getCollection('bookList')
    const result = await bookListCollection.insertOne({
      queryDoc: userId + bookId,
      bookId,
      userId,
      date: new Date().getTime(),
      ...bookFields
    })

    const addBook = await bookListCollection.findOne({ _id: result.insertedId })
    return addBook && MongoHelper.Map(addBook)
  }

  async loadBookByQuery (
    userId: string,
    bookId: string
  ): Promise<AddBookModel | null> {
    const bookCollection = await MongoHelper.getCollection('bookList')
    const book = await bookCollection.findOne({ queryDoc: userId + bookId })
    return book && MongoHelper.Map(book)
  }

  async remove (userId: string, bookId: string): Promise<AddBookModel | null> {
    const bookCollection = await MongoHelper.getCollection('bookList')
    const deleteBook = await bookCollection.findOneAndDelete({ queryDoc: userId + bookId })
    return deleteBook.value && MongoHelper.Map(deleteBook.value)
  }

  async getBooks (userId: string): Promise<AddBookModel[] | null> {
    const bookListCollection = await MongoHelper.getCollection('bookList')
    const books = bookListCollection.find({ userId }, { sort: { date: -1 } })
    const booksFormat = await books.toArray()
    return booksFormat.map((item) => MongoHelper.Map(item))
  }
}

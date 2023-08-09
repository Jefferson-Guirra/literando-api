import { Collection } from 'mongodb'
import { BookListMongoRepository } from './book-list-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddBookModel } from '../../../domain/usecases/book-list/add-book-list'
import { BookModel } from '../../../domain/models/book/book'

const makeFakeAddBookModel = (): AddBookModel => ({
  title: 'any_title',
  description: 'any_description',
  authors: ['any_author'],
  bookId: 'any_book_id',
  price: 0.0,
  language: 'any_language',
  publisher: 'any_publisher',
  publisherDate: 'any_date',
  date: 123456,
  imgUrl: 'any_url',
  id: 'any_id',
  userId: 'any_user_id',
  queryDoc: 'any_user_idany_id',
  pageCount: 1
})

const makeFakeBookForCollection = (date: number): AddBookModel => ({
  title: 'any_title',
  description: 'any_description',
  bookId: 'any_book_id',
  authors: ['any_author'],
  price: 0.0,
  language: 'any_language',
  publisher: 'any_publisher',
  publisherDate: 'any_date',
  date,
  imgUrl: 'any_url',
  id: 'any_id',
  userId: 'any_user_id',
  queryDoc: 'any_user_idany_id',
  pageCount: 1
})

const makeFakeRequest = (): BookModel => {
  return {
    pageCount: 1,
    title: 'any_title',
    description: 'any_description',
    authors: ['any_author'],
    price: 0.0,
    language: 'any_language',
    publisher: 'any_publisher',
    publisherDate: 'any_date',
    imgUrl: 'any_url',
    accessToken: 'any_token',
    bookId: 'any_id'
  }
}

const makeSut = (): BookListMongoRepository => new BookListMongoRepository()
let bookCollection: Collection

describe('BookListMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    bookCollection = await MongoHelper.getCollection('bookList')
    await bookCollection.deleteMany({})
  })
  test('should add book in BookListMongoRepository if addBook success', async () => {
    const sut = makeSut()
    await sut.addBook(makeFakeRequest(), 'any_id')
    const count = await bookCollection.countDocuments()
    expect(count).toBe(1)
  })

  test('should return book if addBook success', async () => {
    const sut = makeSut()
    const book = await sut.addBook(makeFakeRequest(), 'any_user_id')
    expect(book).toBeTruthy()
    expect(book?.title).toBe('any_title')
    expect(book?.description).toBe('any_description')
    expect(book?.authors).toEqual(['any_author'])
    expect(book?.price).toBe(0.0)
    expect(book?.language).toBe('any_language')
    expect(book?.publisher).toBe('any_publisher')
    expect(book?.publisherDate).toBe('any_date')
    expect(book?.date).toBeTruthy()
    expect(book?.imgUrl).toBe('any_url')
    expect(book?.id).toBeTruthy()
    expect(book?.userId).toBe('any_user_id')
    expect(book?.queryDoc).toBe('any_user_idany_id')
    expect(book?.pageCount).toBe(1)
  })

  test('should return book if loadBookByQuery success', async () => {
    const sut = makeSut()
    await bookCollection.insertOne({
      title: 'any_title',
      description: 'any_description',
      authors: ['any_author'],
      price: 0.0,
      language: 'any_language',
      publisher: 'any_publisher',
      publisherDate: 'any_date',
      pageCount: 1,
      date: 123456,
      imgUrl: 'any_url',
      id: 'any_id',
      userId: 'any_user_id',
      queryDoc: 'any_user_idany_id'
    })
    const book = await sut.loadBookByQuery('any_user_id', 'any_id')
    expect(book).toBeTruthy()
    expect(book?.title).toBe('any_title')
    expect(book?.description).toBe('any_description')
    expect(book?.authors).toEqual(['any_author'])
    expect(book?.price).toBe(0.0)
    expect(book?.language).toBe('any_language')
    expect(book?.publisher).toBe('any_publisher')
    expect(book?.publisherDate).toBe('any_date')
    expect(book?.date).toBe(123456)
    expect(book?.imgUrl).toBe('any_url')
    expect(book?.id).toBeTruthy()
    expect(book?.pageCount).toBe(1)
    expect(book?.userId).toBe('any_user_id')
    expect(book?.queryDoc).toBe('any_user_idany_id')
  })

  test('should remove book if remove success ', async () => {
    const sut = makeSut()
    await bookCollection.insertOne(makeFakeAddBookModel())
    let count = await bookCollection.countDocuments()
    expect(count).toBe(1)
    const removeBook = await sut.remove('any_user_id', 'any_id')
    expect(removeBook).toBeTruthy()
    expect(removeBook?.title).toBe('any_title')
    expect(removeBook?.description).toBe('any_description')
    expect(removeBook?.authors).toEqual(['any_author'])
    expect(removeBook?.price).toBe(0.0)
    expect(removeBook?.language).toBe('any_language')
    expect(removeBook?.publisher).toBe('any_publisher')
    expect(removeBook?.publisherDate).toBe('any_date')
    expect(removeBook?.date).toBe(123456)
    expect(removeBook?.imgUrl).toBe('any_url')
    expect(removeBook?.pageCount).toBe(1)
    expect(removeBook?.id).toBeTruthy()
    expect(removeBook?.userId).toBe('any_user_id')
    expect(removeBook?.queryDoc).toBe('any_user_idany_id')
    count = await bookCollection.countDocuments()
    expect(count).toBe(0)
  })

  test('should return books if getBooks success', async () => {
    const sut = makeSut()
    await bookCollection.insertMany([
      makeFakeBookForCollection(2),
      makeFakeBookForCollection(4)
    ])
    const books = (await sut.getBooks('any_user_id')) as AddBookModel[]
    expect(books).toBeTruthy()
    expect(books?.length).toBe(2)
    expect(books[0]?.date).toBe(4)
    expect(books[1]?.date).toBe(2)
  })

  test('should return empty array if getBooks return empty array', async () => {
    const sut = makeSut()
    const books = await sut.getBooks('any_user_id')
    expect(books).toEqual([])
  })
})

export {}

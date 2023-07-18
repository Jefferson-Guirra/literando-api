import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { BuyBooksListMongoRepository } from './book-buy-list-mongo-repository'
import { BookModel } from '../../../domain/models/book/book'
import { AddBuyBookModel } from '../../../domain/usecases/book-buy-list/add-book-buy-list'

const makeFakeAddBuyBook = (): any => ({
  authors: ['any_author'],
  description: 'any_description',
  title: 'any_title',
  imgUrl: 'any_url',
  pageCount: 1,
  language: 'any_language',
  price: 0,
  amount: 1,
  bookId: 'any_id',
  date: new Date().getTime(),
  userId: 'any_user_id',
  queryDoc: 'any_user_id' + 'any_id',
  publisher: 'any_publisher',
  publisherDate: 'any_date'
})

const makeFakeOrderBooks = (title: string, date: number): any => ({
  authors: ['any_author'],
  description: 'any_description',
  title,
  imgUrl: 'any_url',
  language: 'any_language',
  price: 0,
  amount: 1,
  bookId: 'any_id',
  date,
  pageCount: 1,
  userId: 'any_user_id',
  queryDoc: 'any_user_id' + 'any_id',
  publisher: 'any_publisher',
  publisherDate: 'any_date'
})
const makeFakeRequest = (): BookModel => ({
  pageCount: 1,
  accessToken: 'any_token',
  bookId: 'any_id',
  authors: ['any_author'],
  description: 'any_description',
  title: 'any_title',
  imgUrl: 'any_url',
  language: 'any_language',
  price: 0,
  publisher: 'any_publisher',
  publisherDate: 'any_date'
})
const makeSut = (): BuyBooksListMongoRepository =>
  new BuyBooksListMongoRepository()
let bookBuyListCollection: Collection
describe('BookBuyLIstMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    bookBuyListCollection = await MongoHelper.getCollection('buyBooksList')
    await bookBuyListCollection.deleteMany({})
  })
  test('should add book on success', async () => {
    const sut = makeSut()
    let count = await bookBuyListCollection.countDocuments()
    expect(count).toBe(0)
    const book = await sut.addBook(makeFakeRequest(), 'any_user_id')
    count = await bookBuyListCollection.countDocuments()
    expect(count).toBe(1)
    expect(book).toBeTruthy()
    expect(book?.title).toBe('any_title')
    expect(book?.description).toBe('any_description')
    expect(book?.date).toBeTruthy()
    expect(book?.authors).toEqual(['any_author'])
    expect(book?.id).toBeTruthy()
    expect(book?.imgUrl).toBe('any_url')
    expect(book?.language).toBe('any_language')
    expect(book?.price).toBe(0)
    expect(book?.publisher).toBe('any_publisher')
    expect(book?.publisherDate).toBe('any_date')
    expect(book?.queryDoc).toBe('any_user_id' + 'any_id')
    expect(book?.amount).toBe(1)
    expect(book?.pageCount).toBe(1)
  })

  test('should return a book if LoadBookByQueryDoc success ', async () => {
    const sut = makeSut()
    const result = await bookBuyListCollection.insertOne(makeFakeAddBuyBook())
    const addBook = await bookBuyListCollection.findOne({
      _id: result.insertedId
    })
    const book = await sut.loadBookByQueryDoc(addBook?.userId, addBook?.bookId)
    expect(book).toBeTruthy()
    expect(book?.title).toBe('any_title')
    expect(book?.description).toBe('any_description')
    expect(book?.date).toBeTruthy()
    expect(book?.authors).toEqual(['any_author'])
    expect(book?.id).toBeTruthy()
    expect(book?.imgUrl).toBe('any_url')
    expect(book?.language).toBe('any_language')
    expect(book?.price).toBe(0)
    expect(book?.publisher).toBe('any_publisher')
    expect(book?.publisherDate).toBe('any_date')
    expect(book?.queryDoc).toBe('any_user_id' + 'any_id')
    expect(book?.amount).toBe(1)
    expect(book?.pageCount).toBe(1)
  })

  test('should return null if LoadBookByQueryDoc return null', async () => {
    const sut = makeSut()
    const book = await sut.loadBookByQueryDoc('any_user_id', 'any_id')
    expect(book).toBeFalsy()
  })

  test('should return book if UpdateAmountBook success', async () => {
    const sut = makeSut()
    const result = await bookBuyListCollection.insertOne(makeFakeAddBuyBook())
    const addBook = (await bookBuyListCollection.findOne({
      _id: result.insertedId
    })) as any
    expect(addBook?.amount).toBe(1)
    const book = await sut.updateAmount(addBook)
    expect(book?.amount).toEqual(2)
    expect(book?.pageCount).toBe(1)
    expect(book).toBeTruthy()
    expect(book?.title).toBe('any_title')
    expect(book?.description).toBe('any_description')
    expect(book?.date).toBeTruthy()
    expect(book?.authors).toEqual(['any_author'])
    expect(book?.id).toBeTruthy()
    expect(book?.imgUrl).toBe('any_url')
    expect(book?.language).toBe('any_language')
    expect(book?.price).toBe(0)
    expect(book?.publisher).toBe('any_publisher')
    expect(book?.publisherDate).toBe('any_date')
    expect(book?.queryDoc).toBe('any_user_id' + 'any_id')
  })

  test('should return book if removeAmountBook success', async () => {
    const sut = makeSut()
    const result = await bookBuyListCollection.insertOne(makeFakeAddBuyBook())
    const book: any = await bookBuyListCollection.findOne({
      _id: result.insertedId
    })
    const removeBookAmount = await sut.removeAmountBook(book)
    expect(removeBookAmount).toBeTruthy()
    expect(removeBookAmount?.amount).toEqual(0)
    expect(removeBookAmount).toBeTruthy()
    expect(removeBookAmount?.title).toBe('any_title')
    expect(removeBookAmount?.description).toBe('any_description')
    expect(removeBookAmount?.date).toBeTruthy()
    expect(removeBookAmount?.authors).toEqual(['any_author'])
    expect(removeBookAmount?.id).toBeTruthy()
    expect(removeBookAmount?.imgUrl).toBe('any_url')
    expect(removeBookAmount?.language).toBe('any_language')
    expect(removeBookAmount?.price).toBe(0)
    expect(removeBookAmount?.publisher).toBe('any_publisher')
    expect(removeBookAmount?.publisherDate).toBe('any_date')
    expect(removeBookAmount?.queryDoc).toBe('any_user_id' + 'any_id')
    expect(removeBookAmount?.pageCount).toBe(1)
  })

  test('should return null if removeAmountBook return null', async () => {
    const sut = makeSut()
    const addBuyBook: AddBuyBookModel = {
      id: 'any_id',
      ...makeFakeAddBuyBook()
    }
    const response = await sut.removeAmountBook(addBuyBook)
    expect(response).toBeFalsy()
  })

  test('should return books if getBooks success', async () => {
    const sut = makeSut()
    await bookBuyListCollection.insertOne(makeFakeOrderBooks('first_book', 1))
    await bookBuyListCollection.insertOne(makeFakeOrderBooks('second_book', 2))
    const books: any = await sut.getBuyBooks('any_user_id')
    expect(books).toBeTruthy()
    expect(books[0].title).toBe('second_book')
    expect(books[1].title).toBe('first_book')
  })

  test('should return empty array a books if getBuyBooks return empty array', async () => {
    const sut = makeSut()
    const response = await sut.getBuyBooks('any_user_id')
    expect(response).toEqual([])
  })

  test('should return a book if deleteBuyBook success', async () => {
    const sut = makeSut()
    await bookBuyListCollection.insertOne(makeFakeAddBuyBook())
    let count = await bookBuyListCollection.countDocuments()
    expect(count).toBe(1)
    const deleteBook = await sut.deleteBuyBook('any_user_id', 'any_id')
    expect(deleteBook).toBeTruthy()
    expect(deleteBook?.amount).toEqual(1)
    expect(deleteBook).toBeTruthy()
    expect(deleteBook?.title).toBe('any_title')
    expect(deleteBook?.description).toBe('any_description')
    expect(deleteBook?.date).toBeTruthy()
    expect(deleteBook?.authors).toEqual(['any_author'])
    expect(deleteBook?.id).toBeTruthy()
    expect(deleteBook?.imgUrl).toBe('any_url')
    expect(deleteBook?.language).toBe('any_language')
    expect(deleteBook?.price).toBe(0)
    expect(deleteBook?.publisher).toBe('any_publisher')
    expect(deleteBook?.publisherDate).toBe('any_date')
    expect(deleteBook?.pageCount).toBe(1)
    expect(deleteBook?.queryDoc).toBe('any_user_id' + 'any_id')
    count = await bookBuyListCollection.countDocuments()
    expect(count).toEqual(0)
  })

  test('should return null if deleteBuyBook return null', async () => {
    const sut = makeSut()
    const response = await sut.deleteBuyBook('any_book_id', 'any_id')
    expect(response).toBeFalsy()
  })

  test('should return a book if addAmount success', async () => {
    const sut = makeSut()
    const result = await bookBuyListCollection.insertOne(makeFakeAddBuyBook())
    const findBook: any = await bookBuyListCollection.findOne({
      _id: result.insertedId
    })
    expect(findBook?.amount).toBe(1)
    const book = await sut.addAmount(findBook, 5)
    expect(book).toBeTruthy()
    expect(book?.title).toBe('any_title')
    expect(book?.description).toBe('any_description')
    expect(book?.date).toBeTruthy()
    expect(book?.authors).toEqual(['any_author'])
    expect(book?.id).toBeTruthy()
    expect(book?.imgUrl).toBe('any_url')
    expect(book?.language).toBe('any_language')
    expect(book?.price).toBe(0)
    expect(book?.publisher).toBe('any_publisher')
    expect(book?.publisherDate).toBe('any_date')
    expect(book?.queryDoc).toBe('any_user_id' + 'any_id')
    expect(book?.amount).toBe(5)
    expect(book?.pageCount).toBe(1)
  })

  test('remove all books if DeleteAllBooks success', async () => {
    const sut = makeSut()
    await bookBuyListCollection.insertMany([
      makeFakeAddBuyBook(),
      makeFakeAddBuyBook()
    ])
    let count = await bookBuyListCollection.countDocuments()
    expect(count).toEqual(2)
    await sut.deleteAllBooks('any_user_id')
    count = await bookBuyListCollection.countDocuments()
    expect(count).toEqual(0)
  })

  test('should return book if getBook success', async () => {
    await bookBuyListCollection.insertOne(makeFakeAddBuyBook())
    const sut = makeSut()
    const book = await sut.getBook('any_user_id', 'any_id')
    expect(book).toBeTruthy()
    expect(book?.title).toBe('any_title')
    expect(book?.description).toBe('any_description')
    expect(book?.date).toBeTruthy()
    expect(book?.authors).toEqual(['any_author'])
    expect(book?.id).toBeTruthy()
    expect(book?.imgUrl).toBe('any_url')
    expect(book?.language).toBe('any_language')
    expect(book?.price).toBe(0)
    expect(book?.publisher).toBe('any_publisher')
    expect(book?.publisherDate).toBe('any_date')
    expect(book?.queryDoc).toBe('any_user_id' + 'any_id')
    expect(book?.amount).toBe(1)
    expect(book?.pageCount).toBe(1)
  })

  test('should return null if getBook return null', async () => {
    const sut = makeSut()
    const response = await sut.getBook('any_user_id', 'any_id')
    expect(response).toBeFalsy()
  })
})

export {}

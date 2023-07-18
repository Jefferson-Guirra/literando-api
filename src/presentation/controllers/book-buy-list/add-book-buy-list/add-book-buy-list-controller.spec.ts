import { BookModel } from '../../../../domain/models/book/book'
import {
  AddBookBuyList,
  AddBuyBookModel
} from '../../../../domain/usecases/book-buy-list/add-book-buy-list'
import { MissingParamError } from '../../../errors/missing-params-error'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '../../../helpers/http/http'
import { HttpRequest } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'
import { AddBookBuyListController } from './add-book-buy-list-controller'

const makeFakeAddBuyBook = (): AddBuyBookModel => ({
  pageCount: 1,
  authors: ['any_author'],
  amount: 0,
  date: 0,
  description: 'any_description',
  title: 'any_title',
  bookId: 'any_book_id',
  id: 'any_id',
  imgUrl: 'any_url',
  language: 'any-language',
  price: 0,
  publisher: 'any_publisher',
  publisherDate: 'any_date',
  queryDoc: 'any_id_doc',
  userId: 'any_user_id'
})

const makeFakeAddBookBuyList = (): AddBookBuyList => {
  class AddBookBuyListStub implements AddBookBuyList {
    async add (book: BookModel): Promise<AddBuyBookModel | null> {
      return await Promise.resolve(makeFakeAddBuyBook())
    }
  }

  return new AddBookBuyListStub()
}
const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validation (input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
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
  }
})

interface SutTypes {
  addBuyBookListStub: AddBookBuyList
  validateStub: Validation
  sut: AddBookBuyListController
}

const makeSut = (): SutTypes => {
  const addBuyBookListStub = makeFakeAddBookBuyList()
  const validateStub = makeValidationStub()
  const sut = new AddBookBuyListController(validateStub, addBuyBookListStub)
  return {
    addBuyBookListStub,
    validateStub,
    sut
  }
}
describe('AddBookBuyListController', () => {
  test('should call validate with correct values', async () => {
    const { sut, validateStub } = makeSut()
    const validateSpy = jest.spyOn(validateStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('should return 400 if validate return error', async () => {
    const { sut, validateStub } = makeSut()
    jest
      .spyOn(validateStub, 'validation')
      .mockReturnValueOnce(new MissingParamError('any_field'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('should call AddBook with correct values', async () => {
    const { sut, addBuyBookListStub } = makeSut()
    const addSpy = jest.spyOn(addBuyBookListStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })

  test('should return 401 if addBook return undefined', async () => {
    const { sut, addBuyBookListStub } = makeSut()
    jest
      .spyOn(addBuyBookListStub, 'add')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
  })

  test('should return 500 if addBook fails', async () => {
    const { sut, addBuyBookListStub } = makeSut()
    jest
      .spyOn(addBuyBookListStub, 'add')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError())
  })

  test('should return 200 on a succeeds', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(ok(makeFakeAddBuyBook()))
  })
})

export {}

import { AddBuyBookModel } from '../../../../domain/usecases/book-buy-list/add-book-buy-list'
import { GetBookBuyList } from '../../../../domain/usecases/book-buy-list/get-book-buy-list'
import { MissingParamError } from '../../../errors/missing-params-error'
import { badRequest, ok, unauthorized } from '../../../helpers/http/http'
import { HttpRequest } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'
import { GetBookBuyListController } from './get-book-buy-list-controller'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    accessToken: 'any_token',
    bookId: 'any_book_id'
  }
})

const makeFakeAddBuyBookModel = (): AddBuyBookModel => ({
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

const makeDbGetBuyBookListStub = (): GetBookBuyList => {
  class DbGetBookBuyListStub implements GetBookBuyList {
    async getBook (
      accessToken: string,
      bookId: string
    ): Promise<AddBuyBookModel | null | undefined> {
      return await Promise.resolve(makeFakeAddBuyBookModel())
    }
  }
  return new DbGetBookBuyListStub()
}
const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validation (input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  dbGetBookBuyListStub: GetBookBuyList
  validationStub: Validation
  sut: GetBookBuyListController
}

const makeSut = (): SutTypes => {
  const dbGetBookBuyListStub = makeDbGetBuyBookListStub()
  const validationStub = makeValidationStub()
  const sut = new GetBookBuyListController(validationStub, dbGetBookBuyListStub)

  return {
    dbGetBookBuyListStub,
    validationStub,
    sut
  }
}

describe('GetBookBuyListController', () => {
  test('should call validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validationSpy = jest.spyOn(validationStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validationSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('should return 400 if validation return error', async () => {
    const { sut, validationStub } = makeSut()
    jest
      .spyOn(validationStub, 'validation')
      .mockReturnValueOnce(new MissingParamError('any_field'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('should call getBook with correct value', async () => {
    const { sut, dbGetBookBuyListStub } = makeSut()
    const getBookSpy = jest.spyOn(dbGetBookBuyListStub, 'getBook')
    await sut.handle(makeFakeRequest())
    expect(getBookSpy).toHaveBeenCalledWith('any_token', 'any_book_id')
  })

  test('should return 401 if getBook return undefined', async () => {
    const { sut, dbGetBookBuyListStub } = makeSut()
    jest
      .spyOn(dbGetBookBuyListStub, 'getBook')
      .mockReturnValueOnce(Promise.resolve(undefined))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
  })

  test('should return null if getBook return null', async () => {
    const { sut, dbGetBookBuyListStub } = makeSut()
    jest
      .spyOn(dbGetBookBuyListStub, 'getBook')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(ok(null))
  })

  test('should return 200 on a succeeds', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(ok(makeFakeAddBuyBookModel()))
  })
})

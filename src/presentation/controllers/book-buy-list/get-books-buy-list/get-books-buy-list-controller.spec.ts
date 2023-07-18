import { GetBuyBooks } from '../../../../domain/usecases/book-buy-list/get-books-buy-list'
import { MissingParamError } from '../../../errors/missing-params-error'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '../../../helpers/http/http'
import { HttpRequest } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'
import { GetBuyBooksController } from './get-books-buy-list-controller'
import { AddBuyBookModel } from '../../../../domain/usecases/book-buy-list/add-book-buy-list'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    accessToken: 'any_token'
  }
})

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

const makeValidatorStub = (): Validation => {
  class ValidatorStub implements Validation {
    validation (input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidatorStub()
}

const makeGetBuyBooksStub = (): GetBuyBooks => {
  class GetBuyBooksRepositoryStub implements GetBuyBooks {
    async getBuyBooks (accessToken: string): Promise<AddBuyBookModel[] | null> {
      return await Promise.resolve([makeFakeAddBuyBook(), makeFakeAddBuyBook()])
    }
  }

  return new GetBuyBooksRepositoryStub()
}
interface SutTypes {
  getBuyBooksStub: GetBuyBooks
  validatorStub: Validation
  sut: GetBuyBooksController
}

const makeSut = (): SutTypes => {
  const getBuyBooksStub = makeGetBuyBooksStub()
  const validatorStub = makeValidatorStub()
  const sut = new GetBuyBooksController(validatorStub, getBuyBooksStub)

  return {
    getBuyBooksStub,
    validatorStub,
    sut
  }
}
describe('GetBuyBooksController', () => {
  test('should call validation with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validationSpy = jest.spyOn(validatorStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validationSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('should return 400 if validation return a error', async () => {
    const { sut, validatorStub } = makeSut()
    jest
      .spyOn(validatorStub, 'validation')
      .mockReturnValue(new MissingParamError('any_field'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('should call getBuyBooks with correct accessToken', async () => {
    const { sut, getBuyBooksStub } = makeSut()
    const getSpy = jest.spyOn(getBuyBooksStub, 'getBuyBooks')
    await sut.handle(makeFakeRequest())
    expect(getSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return 401 if getBuyBooks return null', async () => {
    const { sut, getBuyBooksStub } = makeSut()
    jest
      .spyOn(getBuyBooksStub, 'getBuyBooks')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
  })

  test('should return 500 if getBuyBooks fails', async () => {
    const { sut, getBuyBooksStub } = makeSut()
    jest
      .spyOn(getBuyBooksStub, 'getBuyBooks')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError())
  })

  test('should return 200 on a succeeds', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(ok([makeFakeAddBuyBook(), makeFakeAddBuyBook()]))
  })
})

export {}

import { Validation } from '../../../protocols/validate'
import { HttpRequest } from '../../../protocols/http'
import { UpdateAmountBookBuyListController } from './update-amount-book-buy-list-controller'
import { MissingParamError } from '../../../errors/missing-params-error'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '../../../helpers/http/http'
import { AddBuyBookModel } from '../../../../domain/usecases/book-buy-list/add-book-buy-list'
import { UpdateAmountBuyBook } from '../../../../domain/usecases/book-buy-list/update-amount-book-buy-list'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    accessToken: 'any_token',
    bookId: 'any_id',
    amount: 1
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

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validation (input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

const makeUpdateAmountBuyBookListStub = (): UpdateAmountBuyBook => {
  class UpdateAmountBuyBookListStub implements UpdateAmountBuyBook {
    async updateAmount (
      accessToken: string,
      bookId: string
    ): Promise<AddBuyBookModel | null> {
      return await Promise.resolve(makeFakeAddBuyBook())
    }
  }

  return new UpdateAmountBuyBookListStub()
}

interface SutTypes {
  updateAmountBuyBookStub: UpdateAmountBuyBook
  validatorStub: Validation
  sut: UpdateAmountBookBuyListController
}

const makeSut = (): SutTypes => {
  const updateAmountBuyBookStub = makeUpdateAmountBuyBookListStub()
  const validatorStub = makeValidationStub()
  const sut = new UpdateAmountBookBuyListController(
    validatorStub,
    updateAmountBuyBookStub
  )

  return {
    updateAmountBuyBookStub,
    validatorStub,
    sut
  }
}

describe('UpdateAmountBookBuyListController', () => {
  test('should call validate with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('should return 400 if validate return error', async () => {
    const { sut, validatorStub } = makeSut()
    jest
      .spyOn(validatorStub, 'validation')
      .mockReturnValueOnce(new MissingParamError('any_field'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('should call updateAmount with correct values', async () => {
    const { sut, updateAmountBuyBookStub } = makeSut()
    const updateSpy = jest.spyOn(updateAmountBuyBookStub, 'updateAmount')
    await sut.handle(makeFakeRequest())
    expect(updateSpy).toHaveBeenCalledWith('any_token', 'any_id', 1)
  })

  test('should return 401 if updateAmount return null', async () => {
    const { sut, updateAmountBuyBookStub } = makeSut()
    jest
      .spyOn(updateAmountBuyBookStub, 'updateAmount')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
  })

  test('should return 500 if updateAmount return throw', async () => {
    const { sut, updateAmountBuyBookStub } = makeSut()
    jest
      .spyOn(updateAmountBuyBookStub, 'updateAmount')
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

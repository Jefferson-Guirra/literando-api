import { AddBuyBookModel } from '../../../../domain/usecases/book-buy-list/add-book-buy-list'
import { DeleteBuyBookList } from '../../../../domain/usecases/book-buy-list/delete-book-buy-list'
import { MissingParamError } from '../../../errors/missing-params-error'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '../../../helpers/http/http'
import { HttpRequest } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'
import { DeleteBuyBookListController } from './delete-book-buy-list-controller'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    accessToken: 'any_token',
    bookId: 'any_id'
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

const makeDeleteBuyBookListStub = (): DeleteBuyBookList => {
  class DeleteBuyBookListStub implements DeleteBuyBookList {
    async deleteBook (
      accessToken: string,
      bookId: string
    ): Promise<AddBuyBookModel | null> {
      return await Promise.resolve(makeFakeAddBuyBook())
    }
  }
  return new DeleteBuyBookListStub()
}
interface SutTypes {
  validatorStub: Validation
  deleteBuyBookStub: DeleteBuyBookList
  sut: DeleteBuyBookListController
}
const makeSut = (): SutTypes => {
  const deleteBuyBookStub = makeDeleteBuyBookListStub()
  const validatorStub = makeValidatorStub()
  const sut = new DeleteBuyBookListController(validatorStub, deleteBuyBookStub)
  return {
    deleteBuyBookStub,
    validatorStub,
    sut
  }
}
describe('DeleteBuyBookList', () => {
  test('should call validation wit correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validationSpy = jest.spyOn(validatorStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validationSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('should return 400 if validation return a error', async () => {
    const { sut, validatorStub } = makeSut()
    jest
      .spyOn(validatorStub, 'validation')
      .mockReturnValueOnce(new MissingParamError('any_field'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('should call deleteBuyBook wit correct values', async () => {
    const { sut, deleteBuyBookStub } = makeSut()
    const deleteSpy = jest.spyOn(deleteBuyBookStub, 'deleteBook')
    await sut.handle(makeFakeRequest())
    expect(deleteSpy).toHaveBeenCalledWith('any_token', 'any_id')
  })

  test('should return 401 if deleteBook return null ', async () => {
    const { sut, deleteBuyBookStub } = makeSut()
    jest
      .spyOn(deleteBuyBookStub, 'deleteBook')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
  })

  test('should return 500 if deleteBook fails ', async () => {
    const { sut, deleteBuyBookStub } = makeSut()
    jest
      .spyOn(deleteBuyBookStub, 'deleteBook')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError())
  })

  test('should return 200 on succeeds', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(ok(makeFakeAddBuyBook()))
  })
})

export {}

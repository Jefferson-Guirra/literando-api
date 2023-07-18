import { AddBookModel } from '../../../../domain/usecases/book-list/add-book-list'
import { GetBookList } from '../../../../domain/usecases/book-list/get-book-list'
import { MissingParamError } from '../../../errors/missing-params-error'
import { badRequest, ok, serverError } from '../../../helpers/http/http'
import { HttpRequest } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'
import { GetBookListController } from './get-book-list-controller'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    accessToken: 'any_token',
    bookId: 'any_id'
  }
})

const makeFakeAddBookModel = (): AddBookModel => {
  return {
    pageCount: 1,
    title: 'any_title',
    bookId: 'any_book_id',
    description: 'any_description',
    authors: ['any_author'],
    price: 0.0,
    language: 'any_language',
    publisher: 'any_publisher',
    date: 1254632254,
    publisherDate: 'any_date',
    imgUrl: 'any_url',
    id: 'any_id',
    userId: 'any_user_id',
    queryDoc: 'any_user_idany_id'
  }
}

const makeValidateStub = (): Validation => {
  class ValidateStub implements Validation {
    validation (input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidateStub()
}

const makeGetBookListStub = (): GetBookList => {
  class GetBookListStub implements GetBookList {
    async getBook (
      accessToken: string,
      bookId: string
    ): Promise<AddBookModel | null> {
      return await Promise.resolve(makeFakeAddBookModel())
    }
  }
  return new GetBookListStub()
}

interface SutTypes {
  getBookListStub: GetBookList
  validationStub: Validation
  sut: GetBookListController
}

const makeSut = (): SutTypes => {
  const getBookListStub = makeGetBookListStub()
  const validationStub = makeValidateStub()
  const sut = new GetBookListController(validationStub, getBookListStub)
  return {
    getBookListStub,
    validationStub,
    sut
  }
}

describe('GetBookListController', () => {
  test('should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validationSpy = jest.spyOn(validationStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validationSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('should return 400 if validation return a error ', async () => {
    const { sut, validationStub } = makeSut()
    jest
      .spyOn(validationStub, 'validation')
      .mockReturnValueOnce(new MissingParamError('any_field'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('should call getBooks with correct values', async () => {
    const { sut, getBookListStub } = makeSut()
    const getSpy = jest.spyOn(getBookListStub, 'getBook')
    await sut.handle(makeFakeRequest())
    expect(getSpy).toHaveBeenCalledWith('any_token', 'any_id')
  })

  test('should return 500 if getBooks fails', async () => {
    const { sut, getBookListStub } = makeSut()
    jest
      .spyOn(getBookListStub, 'getBook')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError())
  })

  test('should return a book on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(ok(makeFakeAddBookModel()))
  })
})

export {}

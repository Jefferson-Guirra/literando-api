import { HttpRequest } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'
import { AddBookListController } from './add-book-list-controller'
import {
  badRequest,
  serverError,
  unauthorized,
  ok
} from '../../../helpers/http/http'
import { MissingParamError } from '../../../errors/missing-params-error'
import { BookModel } from '../../../../domain/models/book/book'
import {
  AddBookList,
  AddBookModel
} from '../../../../domain/usecases/book-list/add-book-list'

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

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
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
}
const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validation (input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

const makeAddBookListStub = (): AddBookList => {
  class AddBookListStub implements AddBookList {
    async add (book: BookModel): Promise<AddBookModel | null> {
      return await Promise.resolve(makeFakeAddBookModel())
    }
  }
  return new AddBookListStub()
}
interface SutTypes {
  validationStub: Validation
  addBookListStub: AddBookList
  sut: AddBookListController
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const addBookListStub = makeAddBookListStub()
  const sut = new AddBookListController(validationStub, addBookListStub)

  return {
    validationStub,
    addBookListStub,
    sut
  }
}

describe('LoginController', () => {
  test('should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest())
  })
  test('should return 400 if validation return error', async () => {
    const { sut, validationStub } = makeSut()
    jest
      .spyOn(validationStub, 'validation')
      .mockReturnValueOnce(new MissingParamError('any_field'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('should call addBook with correct values', async () => {
    const { sut, addBookListStub } = makeSut()
    const addBookSpy = jest.spyOn(addBookListStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addBookSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })

  test('should return 500 if addBook fails', async () => {
    const { sut, addBookListStub } = makeSut()
    jest
      .spyOn(addBookListStub, 'add')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('should return 401 if addAccount return null', async () => {
    const { sut, addBookListStub } = makeSut()
    jest
      .spyOn(addBookListStub, 'add')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
  })

  test('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(ok(makeFakeAddBookModel()))
  })
})

export {}

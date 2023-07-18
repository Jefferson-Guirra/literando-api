import { AddBookModel } from '../../../../domain/usecases/book-list/add-book-list'
import { RemoveBookList } from '../../../../domain/usecases/book-list/remove-book-list'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '../../../helpers/http/http'
import { HttpRequest } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'
import { RemoveBookListController } from './remove-book-list-controller'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    accessToken: 'any_token',
    idBook: 'any_id'
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
const makeRemoveBookStub = (): RemoveBookList => {
  class RemoveBookStub implements RemoveBookList {
    async remove (
      accessToken: string,
      idBook: string
    ): Promise<AddBookModel | null> {
      return await Promise.resolve(makeFakeAddBookModel())
    }
  }
  return new RemoveBookStub()
}
const makeValidateStub = (): Validation => {
  class ValidateStub implements Validation {
    validation (input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidateStub()
}

interface sutTypes {
  validateStub: Validation
  removeBookStub: RemoveBookList
  sut: RemoveBookListController
}

const makeSut = (): sutTypes => {
  const validateStub = makeValidateStub()
  const removeBookStub = makeRemoveBookStub()
  const sut = new RemoveBookListController(validateStub, removeBookStub)
  return {
    validateStub,
    removeBookStub,
    sut
  }
}
describe('RemoveBookListController', () => {
  test('should call validation with correct values', async () => {
    const { validateStub, sut } = makeSut()
    const validationSpy = jest.spyOn(validateStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validationSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('should return 400 if validation return error', async () => {
    const { sut, validateStub } = makeSut()
    jest
      .spyOn(validateStub, 'validation')
      .mockReturnValueOnce(new Error('any_field'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new Error('any_field')))
  })

  test('should call remove with correct values', async () => {
    const { sut, removeBookStub } = makeSut()
    const removeSpy = jest.spyOn(removeBookStub, 'remove')
    await sut.handle(makeFakeRequest())
    expect(removeSpy).toHaveBeenCalledWith('any_token', 'any_id')
  })

  test('should return 401 if remove return undefined', async () => {
    const { sut, removeBookStub } = makeSut()
    jest
      .spyOn(removeBookStub, 'remove')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
  })

  test('should return 500 if remove fails', async () => {
    const { sut, removeBookStub } = makeSut()
    jest
      .spyOn(removeBookStub, 'remove')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError())
  })

  test('should return 200 on a succeeds', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(ok(makeFakeAddBookModel()))
  })
})

export {}

import { BookModel } from '../../../../domain/models/book/book'
import { AddBookModel } from '../../../../domain/usecases/book-list/add-book-list'
import { ServerError } from '../../../../presentation/errors/server-error'
import {
  LoadAccountByAccessTokenRepository,
  accountLoginModel
} from '../../../protocols/db/account/load-account-by-access-token-repository'
import { AddBookListRepository } from '../../../protocols/db/book-list/add-book-list-repository'
import { LoadBookByQueryDocRepository } from '../../../protocols/db/book-list/load-book-list-by-query-doc'
import { GetDate } from './protocols/get-date'
import { DbAddBookList } from './db-add-book-list'
import { CreateQueryDoc } from './protocols/create-query-doc'

const makeFakeLoadAccountByAccessToken =
  (): LoadAccountByAccessTokenRepository => {
    class LoadAccountByAccessTokenStub
    implements LoadAccountByAccessTokenRepository {
      async loadByAccessToken (
        accessToken: string
      ): Promise<accountLoginModel | null> {
        return await Promise.resolve({
          username: 'any_username',
          password: 'any_password',
          email: 'any_email',
          accessToken: 'any_token',
          id: 'any_user_id'
        })
      }
    }
    return new LoadAccountByAccessTokenStub()
  }

const makeFakeAddBookModel = (): AddBookModel => {
  return {
    pageCount: 1,
    bookId: 'any_book_id',
    title: 'any_title',
    description: 'any_description',
    authors: ['any_author'],
    price: 0.0,
    language: 'any_language',
    publisher: 'any_publisher',
    publisherDate: 'any_date',
    date: 123456,
    imgUrl: 'any_url',
    queryDoc: 'any_user_idany_id',
    userId: 'any_user_id',
    id: 'any_id'
  }
}

const makeFakeRequest = (): BookModel => {
  return {
    title: 'any_title',
    pageCount: 1,
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

const makeFakeAddBookListRepository = (): AddBookListRepository => {
  class AddBookListRepositoryStub implements AddBookListRepository {
    async addBook (book: BookModel, userId: string): Promise<AddBookModel> {
      return await Promise.resolve(makeFakeAddBookModel())
    }
  }

  return new AddBookListRepositoryStub()
}

const makeFakeGetDate = (): GetDate => {
  class GetDateStub implements GetDate {
    public readonly date = 123456
  }
  return new GetDateStub()
}

const makeCreateQueryDocStub = (): CreateQueryDoc => {
  class CreateQueryDocStub implements CreateQueryDoc {
    create (userId: string, idBook: string): string {
      return userId + idBook
    }
  }
  return new CreateQueryDocStub()
}

const makeLoadBookByQueryDocStub = (): LoadBookByQueryDocRepository => {
  class LoadBookByQueryDocRepositoryStub
  implements LoadBookByQueryDocRepository {
    async loadBookByQuery (idDoc: string): Promise<AddBookModel | null> {
      return await Promise.resolve(null)
    }
  }
  return new LoadBookByQueryDocRepositoryStub()
}
interface SutTypes {
  loadAccountByAccessTokenStub: LoadAccountByAccessTokenRepository
  addBookListRepositoryStub: AddBookListRepository
  createQueryDocStub: CreateQueryDoc
  getDateStub: GetDate
  loadBookByQueryDocStub: LoadBookByQueryDocRepository
  sut: DbAddBookList
}

const makeSut = (): SutTypes => {
  const loadAccountByAccessTokenStub = makeFakeLoadAccountByAccessToken()
  const addBookListRepositoryStub = makeFakeAddBookListRepository()
  const getDateStub = makeFakeGetDate()
  const createQueryDocStub = makeCreateQueryDocStub()
  const loadBookByQueryDocStub = makeLoadBookByQueryDocStub()
  const sut = new DbAddBookList(
    loadAccountByAccessTokenStub,
    addBookListRepositoryStub,
    loadBookByQueryDocStub
  )
  return {
    loadAccountByAccessTokenStub,
    addBookListRepositoryStub,
    getDateStub,
    createQueryDocStub,
    loadBookByQueryDocStub,
    sut
  }
}
describe('DbAddBookList', () => {
  test('should call loadAccountByAccessToken with correct token', async () => {
    const { sut, loadAccountByAccessTokenStub } = makeSut()
    const loadSpy = jest.spyOn(
      loadAccountByAccessTokenStub,
      'loadByAccessToken'
    )
    await sut.add(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return throw if loadAccountByAccessToken fails', async () => {
    const { sut, loadAccountByAccessTokenStub } = makeSut()
    jest
      .spyOn(loadAccountByAccessTokenStub, 'loadByAccessToken')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(makeFakeRequest())
    await expect(promise).rejects.toThrow()
  })

  test('should return undefined if loadAccountByAccessToken return null', async () => {
    const { sut, loadAccountByAccessTokenStub } = makeSut()
    jest
      .spyOn(loadAccountByAccessTokenStub, 'loadByAccessToken')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.add(makeFakeRequest())
    expect(response).toBeFalsy()
  })

  test('should call loadBook with correct idDoc', async () => {
    const { sut, loadBookByQueryDocStub } = makeSut()
    const loadBookSpy = jest.spyOn(loadBookByQueryDocStub, 'loadBookByQuery')
    await sut.add(makeFakeRequest())
    expect(loadBookSpy).toHaveBeenCalledWith('any_user_id', 'any_id')
  })

  test('should return book if loadBook return book ', async () => {
    const { sut, loadBookByQueryDocStub, addBookListRepositoryStub } = makeSut()
    const addBookSpy = jest.spyOn(addBookListRepositoryStub, 'addBook')
    jest
      .spyOn(loadBookByQueryDocStub, 'loadBookByQuery')
      .mockReturnValueOnce(Promise.resolve(makeFakeAddBookModel()))
    const response = await sut.add(makeFakeRequest())
    expect(response).toEqual(makeFakeAddBookModel())
    expect(addBookSpy).toHaveBeenCalledTimes(0)
  })

  test('should return throw if loadBook return throw', async () => {
    const { sut, loadBookByQueryDocStub } = makeSut()
    jest
      .spyOn(loadBookByQueryDocStub, 'loadBookByQuery')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(makeFakeRequest())
    await expect(promise).rejects.toThrow()
  })

  test('should call addBookListRepository with correct values', async () => {
    const { sut, addBookListRepositoryStub } = makeSut()
    const addBookSpy = jest.spyOn(addBookListRepositoryStub, 'addBook')
    await sut.add(makeFakeRequest())
    expect(addBookSpy).toHaveBeenCalledWith(makeFakeRequest(), 'any_user_id')
  })

  test('should return a book if correct values provided', async () => {
    const { sut } = makeSut()
    const response = await sut.add(makeFakeRequest())
    expect(response).toEqual(makeFakeAddBookModel())
  })

  test('should return throw if addBookRepository return null', async () => {
    const { sut, addBookListRepositoryStub } = makeSut()
    jest
      .spyOn(addBookListRepositoryStub, 'addBook')
      .mockReturnValueOnce(Promise.resolve(null))
    const promise = sut.add(makeFakeRequest())
    await expect(promise).rejects.toEqual(new ServerError())
  })

  test('should return throw if addBookRepository return throw', async () => {
    const { sut, addBookListRepositoryStub } = makeSut()
    jest
      .spyOn(addBookListRepositoryStub, 'addBook')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(makeFakeRequest())
    await expect(promise).rejects.toThrow()
  })
})

export {}

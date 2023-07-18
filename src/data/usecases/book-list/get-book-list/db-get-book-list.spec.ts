import { AddBookModel } from '../../../../domain/usecases/book-list/add-book-list'
import { LoadAccountByAccessTokenRepository, accountLoginModel } from '../../../protocols/db/account/load-account-by-access-token-repository'
import { LoadBookByQueryDocRepository } from '../../../protocols/db/book-list/load-book-list-by-query-doc'
import { DbGetBookList } from './db-get-book-list'

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

const makeLoadAccountByAccessToken = (): LoadAccountByAccessTokenRepository => {
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

const makeLoadBookByQueryDocStub = (): LoadBookByQueryDocRepository => {
  class LoadBookByQueryDocRepositoryStub
  implements LoadBookByQueryDocRepository {
    async loadBookByQuery (
      userId: string,
      bookId: string
    ): Promise<AddBookModel | null> {
      return await Promise.resolve(makeFakeAddBookModel())
    }
  }
  return new LoadBookByQueryDocRepositoryStub()
}

interface SutTypes {
  loadBookByQueryDocRepositoryStub: LoadBookByQueryDocRepository
  loadAccountRepositoryStub: LoadAccountByAccessTokenRepository
  sut: DbGetBookList
}

const makeSut = (): SutTypes => {
  const loadBookByQueryDocRepositoryStub = makeLoadBookByQueryDocStub()
  const loadAccountRepositoryStub = makeLoadAccountByAccessToken()
  const sut = new DbGetBookList(
    loadAccountRepositoryStub,
    loadBookByQueryDocRepositoryStub
  )
  return {
    loadBookByQueryDocRepositoryStub,
    loadAccountRepositoryStub,
    sut
  }
}

describe('DbGetBookList', () => {
  test('should call loadAccount with correct value', async () => {
    const { sut, loadAccountRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountRepositoryStub, 'loadByAccessToken')
    await sut.getBook('any_token', 'any_id')
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return throw if loadAccount return throw', async () => {
    const { sut, loadAccountRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountRepositoryStub, 'loadByAccessToken')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.getBook('any_token', 'any_id')
    await expect(promise).rejects.toThrow()
  })

  test('should return null if loadAccount return null', async () => {
    const { sut, loadAccountRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountRepositoryStub, 'loadByAccessToken')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.getBook('any_token', 'any_id')
    expect(response).toBeFalsy()
  })

  test('should call loadBook with correct value', async () => {
    const { sut, loadBookByQueryDocRepositoryStub } = makeSut()
    const loadBookSpy = jest.spyOn(
      loadBookByQueryDocRepositoryStub,
      'loadBookByQuery'
    )
    await sut.getBook('any_token', 'any_id')
    expect(loadBookSpy).toHaveBeenCalledWith('any_user_id', 'any_id')
  })

  test('should return throw if loadBook return throw', async () => {
    const { sut, loadBookByQueryDocRepositoryStub } = makeSut()
    jest
      .spyOn(loadBookByQueryDocRepositoryStub, 'loadBookByQuery')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.getBook('any_token', 'any_id')
    await expect(promise).rejects.toThrow()
  })

  test('should return a book on success', async () => {
    const { sut } = makeSut()
    const response = await sut.getBook('any_token', 'any_id')
    expect(response).toEqual(makeFakeAddBookModel())
  })
})

export {}

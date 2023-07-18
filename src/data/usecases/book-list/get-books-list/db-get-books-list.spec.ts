import { AddBookModel } from '../../../../domain/usecases/book-list/add-book-list'
import {
  LoadAccountByAccessTokenRepository,
  accountLoginModel
} from '../../../protocols/db/account/load-account-by-access-token-repository'
import { GetBooksListRepository } from '../../../protocols/db/book-list/get-books-list-repository'
import { DbGetBooksList } from './db-get-books-list'

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
    publisherDate: 'any_date',
    date: 123456,
    imgUrl: 'any_url',
    queryDoc: 'any_user_idany_id',
    userId: 'any_user_id',
    id: 'any_id'
  }
}
const makeGetBooksListRepositoryStub = (): GetBooksListRepository => {
  class GetBooksListRepositoryStub implements GetBooksListRepository {
    async getBooks (userId: string): Promise<AddBookModel[] | null> {
      return await Promise.resolve([
        makeFakeAddBookModel(),
        makeFakeAddBookModel()
      ])
    }
  }

  return new GetBooksListRepositoryStub()
}

const makeLoadAccountRepositoryStub =
  (): LoadAccountByAccessTokenRepository => {
    class LoadAccountByAccessTokenRepositoryStub
    implements LoadAccountByAccessTokenRepository {
      async loadByAccessToken (
        accessToken: string
      ): Promise<accountLoginModel | null> {
        return await Promise.resolve({
          username: 'any_username',
          password: 'any_password',
          email: 'any_email@mail.com',
          accessToken: 'any_token',
          id: 'any_id'
        })
      }
    }

    return new LoadAccountByAccessTokenRepositoryStub()
  }

interface SutTypes {
  getBooksLIstRepositoryStub: GetBooksListRepository
  loadAccountRepositoryStub: LoadAccountByAccessTokenRepository
  sut: DbGetBooksList
}

const makeSut = (): SutTypes => {
  const getBooksLIstRepositoryStub = makeGetBooksListRepositoryStub()
  const loadAccountRepositoryStub = makeLoadAccountRepositoryStub()
  const sut = new DbGetBooksList(
    loadAccountRepositoryStub,
    getBooksLIstRepositoryStub
  )
  return {
    loadAccountRepositoryStub,
    getBooksLIstRepositoryStub,
    sut
  }
}
describe('DbGetBookList', () => {
  test('should call loadAccountByAccessToken with correct token', async () => {
    const { loadAccountRepositoryStub, sut } = makeSut()
    const loadAccountSpy = jest.spyOn(
      loadAccountRepositoryStub,
      'loadByAccessToken'
    )
    await sut.getBooks('any_token')
    expect(loadAccountSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return throw if loadAccountByAccessToken return throw', async () => {
    const { loadAccountRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadAccountRepositoryStub, 'loadByAccessToken')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.getBooks('any_token')
    await expect(promise).rejects.toThrow()
  })

  test('should return null if loadAccountByAccessTokenRepository return null', async () => {
    const { sut, loadAccountRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountRepositoryStub, 'loadByAccessToken')
      .mockReturnValue(Promise.resolve(null))
    const response = await sut.getBooks('any_token')
    expect(response).toBeFalsy()
  })

  test('should  call getBookListRepository with correct id', async () => {
    const { sut, getBooksLIstRepositoryStub } = makeSut()
    const getBooksSpy = jest.spyOn(getBooksLIstRepositoryStub, 'getBooks')
    await sut.getBooks('any_token')
    expect(getBooksSpy).toHaveBeenCalledWith('any_id')
  })

  test('should  return throw if getBookListRepository return throw', async () => {
    const { sut, getBooksLIstRepositoryStub } = makeSut()
    jest
      .spyOn(getBooksLIstRepositoryStub, 'getBooks')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.getBooks('any_token')
    await expect(promise).rejects.toThrow()
  })

  test('should  return null if getBookListRepository return null', async () => {
    const { sut, getBooksLIstRepositoryStub } = makeSut()
    jest
      .spyOn(getBooksLIstRepositoryStub, 'getBooks')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.getBooks('any_token')
    expect(response).toBeFalsy()
  })

  test('should  return books on a succeeds', async () => {
    const { sut } = makeSut()
    const response = await sut.getBooks('any_token')
    expect(response).toEqual([makeFakeAddBookModel(), makeFakeAddBookModel()])
  })
})

export {}

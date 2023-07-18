import { AddBookModel } from '../../../../domain/usecases/book-list/add-book-list'
import {
  LoadAccountByAccessTokenRepository,
  accountLoginModel
} from '../../../protocols/db/account/load-account-by-access-token-repository'
import { RemoveBookListRepository } from '../../../protocols/db/book-list/remove-book-list'
import { DbRemoveBookList } from './db-remove-book-list'

const makeFakeAddBookModel = (): AddBookModel => {
  return {
    pageCount: 1,
    title: 'any_title',
    description: 'any_description',
    authors: ['any_author'],
    bookId: 'any_book_id',
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

const makeFakeAccount = (): accountLoginModel => ({
  username: 'any_username',
  password: 'any_password',
  email: 'any_email',
  accessToken: 'any_token',
  id: 'any_user_id'
})
const makeLoadAccountByAccessTokenStub =
  (): LoadAccountByAccessTokenRepository => {
    class LoadAccountByAccessTokenRepositoryStub
    implements LoadAccountByAccessTokenRepository {
      async loadByAccessToken (
        accessToken: string
      ): Promise<accountLoginModel | null> {
        return await Promise.resolve(makeFakeAccount())
      }
    }
    return new LoadAccountByAccessTokenRepositoryStub()
  }

const makeRemoveBookListRepositoryStub = (): RemoveBookListRepository => {
  class RemoveBookListRepositoryStub implements RemoveBookListRepository {
    async remove (userId: string, bookId: string): Promise<AddBookModel | null> {
      return await Promise.resolve(makeFakeAddBookModel())
    }
  }
  return new RemoveBookListRepositoryStub()
}
interface SutTypes {
  loadAccountByAccessTokenStub: LoadAccountByAccessTokenRepository
  removeBookListRepositoryStub: RemoveBookListRepository
  sut: DbRemoveBookList
}

const makeSut = (): SutTypes => {
  const loadAccountByAccessTokenStub = makeLoadAccountByAccessTokenStub()
  const removeBookListRepositoryStub = makeRemoveBookListRepositoryStub()
  const sut = new DbRemoveBookList(
    loadAccountByAccessTokenStub,
    removeBookListRepositoryStub
  )
  return {
    loadAccountByAccessTokenStub,
    removeBookListRepositoryStub,
    sut
  }
}
describe('DbRemoveBookList', () => {
  test('should call loadAccountByAccessToken wit correct accessToken', async () => {
    const { sut, loadAccountByAccessTokenStub } = makeSut()
    const loadByAccessTokenSpy = jest.spyOn(
      loadAccountByAccessTokenStub,
      'loadByAccessToken'
    )
    await sut.remove('any_token', 'any_id')
    expect(loadByAccessTokenSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return undefined if loadAccount return null', async () => {
    const { sut, loadAccountByAccessTokenStub } = makeSut()
    jest
      .spyOn(loadAccountByAccessTokenStub, 'loadByAccessToken')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.remove('any_token', 'any_id')
    expect(response).toBeFalsy()
  })

  test('should return throw if LoadAccount return throw', async () => {
    const { sut, loadAccountByAccessTokenStub } = makeSut()
    jest
      .spyOn(loadAccountByAccessTokenStub, 'loadByAccessToken')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.remove('any_token', 'any_id')
    await expect(promise).rejects.toThrow()
  })

  test('should call remove with correct values', async () => {
    const { removeBookListRepositoryStub, sut } = makeSut()
    const removeSpy = jest.spyOn(removeBookListRepositoryStub, 'remove')
    await sut.remove('any_token', 'any_id')
    expect(removeSpy).toHaveBeenCalledWith('any_user_id', 'any_id')
  })

  test('should return throw if remove return throw', async () => {
    const { sut, removeBookListRepositoryStub } = makeSut()
    jest
      .spyOn(removeBookListRepositoryStub, 'remove')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.remove('any_token', 'any_id')
    await expect(promise).rejects.toThrow()
  })

  test('should return null if remove return null', async () => {
    const { sut, removeBookListRepositoryStub } = makeSut()
    jest
      .spyOn(removeBookListRepositoryStub, 'remove')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.remove('any_token', 'any_id')
    expect(response).toBeFalsy()
  })

  test('should return a book on a succeeds', async () => {
    const { sut } = makeSut()
    const response = await sut.remove('any_token', 'any_id')
    expect(response).toEqual(makeFakeAddBookModel())
  })
})

export {}

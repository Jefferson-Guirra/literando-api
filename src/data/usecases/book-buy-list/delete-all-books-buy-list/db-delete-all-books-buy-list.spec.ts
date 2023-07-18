import { LoadAccountByAccessTokenRepository, accountLoginModel } from '../../../protocols/db/account/load-account-by-access-token-repository'
import { DeleteAllBuyBooksListRepository } from '../../../protocols/db/book-buy-list/delete-all-books-buy-list-repository'
import { DbDeleteAllBooksBuyList } from './db-delete-all-books-buy-list'

const makeLoadAccountRepositoryStub =
  (): LoadAccountByAccessTokenRepository => {
    class LoadAccountRepositoryStub
    implements LoadAccountByAccessTokenRepository {
      async loadByAccessToken (
        accessToken: string
      ): Promise<accountLoginModel | null> {
        return await Promise.resolve({
          username: 'any_username',
          password: 'any_password',
          email: 'any_email@mail.com',
          id: 'any_user_id',
          accessToken: 'any_token'
        })
      }
    }
    return new LoadAccountRepositoryStub()
  }

const makeDeleteAllBuyBooksListRepositoryStub =
  (): DeleteAllBuyBooksListRepository => {
    class DeleteAllBuyBooksListRepositoryStub
    implements DeleteAllBuyBooksListRepository {
      async deleteAllBooks (userId: string): Promise<void> {
        await Promise.resolve()
      }
    }
    return new DeleteAllBuyBooksListRepositoryStub()
  }

interface SutTypes {
  deleteAllBuyBooksListRepositoryStub: DeleteAllBuyBooksListRepository
  loadAccountRepositoryStub: LoadAccountByAccessTokenRepository
  sut: DbDeleteAllBooksBuyList
}
const makeSut = (): SutTypes => {
  const deleteAllBuyBooksListRepositoryStub =
    makeDeleteAllBuyBooksListRepositoryStub()
  const loadAccountRepositoryStub = makeLoadAccountRepositoryStub()
  const sut = new DbDeleteAllBooksBuyList(
    loadAccountRepositoryStub,
    deleteAllBuyBooksListRepositoryStub
  )
  return {
    deleteAllBuyBooksListRepositoryStub,
    loadAccountRepositoryStub,
    sut
  }
}

describe('DbDeleteAllBooksBuyList', () => {
  test('should call LoadAccount with correct value', async () => {
    const { loadAccountRepositoryStub, sut } = makeSut()
    const loadSpy = jest.spyOn(loadAccountRepositoryStub, 'loadByAccessToken')
    await sut.deleteAllBooks('any_token')
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return null LoadAccount return null', async () => {
    const { loadAccountRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadAccountRepositoryStub, 'loadByAccessToken')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.deleteAllBooks('any_token')
    expect(response).toEqual(null)
  })

  test('should return throw if LoadAccount return throw', async () => {
    const { loadAccountRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadAccountRepositoryStub, 'loadByAccessToken')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const response = sut.deleteAllBooks('any_token')
    await expect(response).rejects.toThrow()
  })

  test('should call deleteAllBooks with correct value', async () => {
    const { deleteAllBuyBooksListRepositoryStub, sut } = makeSut()
    const deleteSpy = jest.spyOn(
      deleteAllBuyBooksListRepositoryStub,
      'deleteAllBooks'
    )
    await sut.deleteAllBooks('any_token')
    expect(deleteSpy).toHaveBeenCalledWith('any_user_id')
  })

  test('should return throw if deleteAllBooks return throw', async () => {
    const { deleteAllBuyBooksListRepositoryStub, sut } = makeSut()
    jest
      .spyOn(deleteAllBuyBooksListRepositoryStub, 'deleteAllBooks')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const response = sut.deleteAllBooks('any_token')
    await expect(response).rejects.toThrow()
  })

  test('should return undefined on a succeeds', async () => {
    const { sut } = makeSut()
    const response = await sut.deleteAllBooks('any_token')
    expect(response).toEqual(undefined)
  })
})

export {}

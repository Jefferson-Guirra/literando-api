import { AddBuyBookModel } from '../../../../domain/usecases/book-buy-list/add-book-buy-list'
import {
  LoadAccountByAccessTokenRepository,
  accountLoginModel
} from '../../../protocols/db/account/load-account-by-access-token-repository'
import { DeleteBuyBookListRepository } from '../../../protocols/db/book-buy-list/delete-buy-book-list-repository'
import { DbDeleteBuyBookList } from './db-delete-buy-book-list'

const makeFakeAddBuyBook = (): AddBuyBookModel => ({
  pageCount: 1,
  authors: ['any_author'],
  description: 'any_description',
  title: 'any_title',
  imgUrl: 'any_url',
  bookId: 'any_book_id',
  language: 'any_language',
  price: 0,
  publisher: 'any_publisher',
  publisherDate: 'any_date',
  amount: 1,
  date: 0,
  id: 'any_id',
  userId: 'any_user_id',
  queryDoc: 'any_user_id' + 'any_id'
})

const makeDeleteBuyBookListRepositoryStub = (): DeleteBuyBookListRepository => {
  class DeleteBuyBookListRepositoryStub implements DeleteBuyBookListRepository {
    async deleteBuyBook (
      userId: string,
      bookId: string
    ): Promise<AddBuyBookModel | null> {
      return await Promise.resolve(makeFakeAddBuyBook())
    }
  }
  return new DeleteBuyBookListRepositoryStub()
}

const makeLoadAccountByAccessTokenStun =
  (): LoadAccountByAccessTokenRepository => {
    class LoadAccountBysAccessTokenRepositoryStub
    implements LoadAccountByAccessTokenRepository {
      async loadByAccessToken (
        accessToken: string
      ): Promise<accountLoginModel | null> {
        return await Promise.resolve({
          username: 'any_username',
          password: 'any_password',
          email: 'any_email@mail.com',
          id: 'any_id',
          accessToken: 'any_token'
        })
      }
    }
    return new LoadAccountBysAccessTokenRepositoryStub()
  }
interface SutTypes {
  deleteBuyBookListRepositoryStub: DeleteBuyBookListRepository
  loadAccountStub: LoadAccountByAccessTokenRepository
  sut: DbDeleteBuyBookList
}
const makeSut = (): SutTypes => {
  const deleteBuyBookListRepositoryStub = makeDeleteBuyBookListRepositoryStub()
  const loadAccountStub = makeLoadAccountByAccessTokenStun()
  const sut = new DbDeleteBuyBookList(
    loadAccountStub,
    deleteBuyBookListRepositoryStub
  )
  return {
    deleteBuyBookListRepositoryStub,
    loadAccountStub,
    sut
  }
}
describe('first', () => {
  test('should call loadAccount with correct token', async () => {
    const { sut, loadAccountStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountStub, 'loadByAccessToken')
    await sut.deleteBook('any_token', 'any_id')
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return throw if loadAccount fails', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest
      .spyOn(loadAccountStub, 'loadByAccessToken')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.deleteBook('any_token', 'any_id')
    await expect(promise).rejects.toThrow()
  })

  test('should return null if loadAccount return null', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest
      .spyOn(loadAccountStub, 'loadByAccessToken')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.deleteBook('any_token', 'any_id')
    expect(response).toBeFalsy()
  })

  test('should call loadAccount with correct token', async () => {
    const { sut, deleteBuyBookListRepositoryStub } = makeSut()
    const deleteSpy = jest.spyOn(
      deleteBuyBookListRepositoryStub,
      'deleteBuyBook'
    )
    await sut.deleteBook('any_token', 'any_book_id')
    expect(deleteSpy).toHaveBeenCalledWith('any_id', 'any_book_id')
  })

  test('should return throw if deleteBuyBook fails', async () => {
    const { sut, deleteBuyBookListRepositoryStub } = makeSut()
    jest
      .spyOn(deleteBuyBookListRepositoryStub, 'deleteBuyBook')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.deleteBook('any_token', 'any_id')
    await expect(promise).rejects.toThrow()
  })

  test('should return a book on succeeds', async () => {
    const { sut } = makeSut()
    const response = await sut.deleteBook('any_token', 'any_book_id')
    expect(response).toEqual(makeFakeAddBuyBook())
  })
})

export {}

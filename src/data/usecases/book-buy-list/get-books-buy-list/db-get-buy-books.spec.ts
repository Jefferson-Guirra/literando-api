import { AddBuyBookModel } from '../../../../domain/usecases/book-buy-list/add-book-buy-list'
import {
  LoadAccountByAccessTokenRepository,
  accountLoginModel
} from '../../../protocols/db/account/load-account-by-access-token-repository'
import { GetBuyBooksRepository } from '../../../protocols/db/book-buy-list/get-books-buy-list-repository'
import { DbGetBuyBooks } from './db-get-buy-books-list'

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

const makeLoadAccountStub = (): LoadAccountByAccessTokenRepository => {
  class LoadAccountByAccessTokenRepositoryStub
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

  return new LoadAccountByAccessTokenRepositoryStub()
}

const makeGetBuyBooksRepositoryStub = (): GetBuyBooksRepository => {
  class GetBuyBooksRepositoryStub implements GetBuyBooksRepository {
    async getBuyBooks (userId: string): Promise<AddBuyBookModel[] | null> {
      return await Promise.resolve([makeFakeAddBuyBook(), makeFakeAddBuyBook()])
    }
  }
  return new GetBuyBooksRepositoryStub()
}
interface SutTypes {
  getBuyBooksRepositoryStub: GetBuyBooksRepository
  loadAccountStub: LoadAccountByAccessTokenRepository
  sut: DbGetBuyBooks
}

const makeSut = (): SutTypes => {
  const getBuyBooksRepositoryStub = makeGetBuyBooksRepositoryStub()
  const loadAccountStub = makeLoadAccountStub()
  const sut = new DbGetBuyBooks(loadAccountStub, getBuyBooksRepositoryStub)
  return {
    getBuyBooksRepositoryStub,
    loadAccountStub,
    sut
  }
}

describe('DbGetBuyBooks', () => {
  test('should call loadAccount with correct accessToken', async () => {
    const { sut, loadAccountStub } = makeSut()
    const loadAccountSpy = jest.spyOn(loadAccountStub, 'loadByAccessToken')
    await sut.getBuyBooks('any_token')
    expect(loadAccountSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return throw if loadAccount fails', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest
      .spyOn(loadAccountStub, 'loadByAccessToken')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.getBuyBooks('any_token')
    await expect(promise).rejects.toThrow()
  })

  test('should return null if loadAccount return null', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest
      .spyOn(loadAccountStub, 'loadByAccessToken')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.getBuyBooks('any_token')
    expect(response).toBeFalsy()
  })

  test('should call getBooks with correct accessToken', async () => {
    const { sut, getBuyBooksRepositoryStub } = makeSut()
    const getSpy = jest.spyOn(getBuyBooksRepositoryStub, 'getBuyBooks')
    await sut.getBuyBooks('any_token')
    expect(getSpy).toHaveBeenCalledWith('any_id')
  })

  test('should return throw if getBooks fails', async () => {
    const { sut, getBuyBooksRepositoryStub } = makeSut()
    jest
      .spyOn(getBuyBooksRepositoryStub, 'getBuyBooks')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.getBuyBooks('any_token')
    await expect(promise).rejects.toThrow()
  })

  test('should return books in success', async () => {
    const { sut } = makeSut()
    const response = await sut.getBuyBooks('any_token')
    expect(response).toEqual([makeFakeAddBuyBook(), makeFakeAddBuyBook()])
  })
})

export {}

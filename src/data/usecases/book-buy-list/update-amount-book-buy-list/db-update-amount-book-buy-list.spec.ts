import { LoadAccountByAccessTokenRepository, accountLoginModel } from '../../../protocols/db/account/load-account-by-access-token-repository'
import { DbUpdateAmountBookBuyList } from './db-update-amount-book-buy-list'
import { AddBuyBookModel } from '../../../../domain/usecases/book-buy-list/add-book-buy-list'
import { LoadBuyBookByQueryDocRepository } from '../../../protocols/db/book-buy-list/load-book-buy-list-by-query-doc-repository'
import { AddAmountBuyBookRepository } from '../../../protocols/db/book-buy-list/add-amount-book-buy-list-repository'

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

const makeLoadBookByQueryDocStub = (): LoadBuyBookByQueryDocRepository => {
  class LoadBookByQueryDocRepositoryStub
  implements LoadBuyBookByQueryDocRepository {
    async loadBookByQueryDoc (
      userId: string,
      bookId: string
    ): Promise<AddBuyBookModel | null> {
      return await Promise.resolve(makeFakeAddBuyBook())
    }
  }

  return new LoadBookByQueryDocRepositoryStub()
}

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
        id: 'any_user_id',
        accessToken: 'any_token'
      })
    }
  }
  return new LoadAccountByAccessTokenRepositoryStub()
}

const makeAddAmountBuyBookStub = (): AddAmountBuyBookRepository => {
  class AddAmountBuyBookRepositoryStub implements AddAmountBuyBookRepository {
    async addAmount (
      book: AddBuyBookModel,
      amount: number
    ): Promise<AddBuyBookModel | null> {
      return await Promise.resolve(makeFakeAddBuyBook())
    }
  }
  return new AddAmountBuyBookRepositoryStub()
}

interface SutTypes {
  addAmountBuyBookStub: AddAmountBuyBookRepository
  loadBookByQueryDocRepositoryStub: LoadBuyBookByQueryDocRepository
  loadAccountStub: LoadAccountByAccessTokenRepository
  sut: DbUpdateAmountBookBuyList
}

const makeSut = (): SutTypes => {
  const addAmountBuyBookStub = makeAddAmountBuyBookStub()
  const loadBookByQueryDocRepositoryStub = makeLoadBookByQueryDocStub()
  const loadAccountStub = makeLoadAccountStub()
  const sut = new DbUpdateAmountBookBuyList(
    loadAccountStub,
    loadBookByQueryDocRepositoryStub,
    addAmountBuyBookStub
  )
  return {
    addAmountBuyBookStub,
    loadBookByQueryDocRepositoryStub,
    loadAccountStub,
    sut
  }
}

describe('DbUpdateAmountBookBuyList', () => {
  test('should call loadAccountByAccessToken wit correct token', async () => {
    const { sut, loadAccountStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountStub, 'loadByAccessToken')
    await sut.updateAmount('any_token', 'any_book_id', 1)
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return throw if loadAccountByAccessToken return throw', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest
      .spyOn(loadAccountStub, 'loadByAccessToken')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.updateAmount('any_token', 'any_book_id', 1)
    await expect(promise).rejects.toThrow()
  })

  test('should return null if loadAccountByAccessToken return null', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest
      .spyOn(loadAccountStub, 'loadByAccessToken')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.updateAmount('any_token', 'any_book_id', 1)
    expect(response).toBeFalsy()
  })

  test('should call LoadBookByQueryDoc with correct values', async () => {
    const { sut, loadBookByQueryDocRepositoryStub } = makeSut()
    const loadBookSpy = jest.spyOn(
      loadBookByQueryDocRepositoryStub,
      'loadBookByQueryDoc'
    )
    await sut.updateAmount('any_token', 'any_book_id', 1)
    expect(loadBookSpy).toBeCalledWith('any_user_id', 'any_book_id')
  })

  test('should return throw if LoadBookByQueryDoc return throw', async () => {
    const { sut, loadBookByQueryDocRepositoryStub } = makeSut()
    jest
      .spyOn(loadBookByQueryDocRepositoryStub, 'loadBookByQueryDoc')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.updateAmount('any_token', 'any_book_id', 1)
    await expect(promise).rejects.toThrow()
  })

  test('should return null if LoadBookByQueryDoc return null', async () => {
    const { sut, loadBookByQueryDocRepositoryStub } = makeSut()
    jest
      .spyOn(loadBookByQueryDocRepositoryStub, 'loadBookByQueryDoc')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.updateAmount('any_token', 'any_book_id', 1)
    expect(response).toBeFalsy()
  })

  test('should call addAmount witch correct values', async () => {
    const { sut, addAmountBuyBookStub } = makeSut()
    const addAmountSpy = jest.spyOn(addAmountBuyBookStub, 'addAmount')
    await sut.updateAmount('any_token', 'any_book_id', 1)
    expect(addAmountSpy).toHaveBeenCalledWith(makeFakeAddBuyBook(), 1)
  })

  test('should return throw if addAmount return throw', async () => {
    const { sut, addAmountBuyBookStub } = makeSut()
    jest
      .spyOn(addAmountBuyBookStub, 'addAmount')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.updateAmount('any_token', 'any_book_id', 1)
    await expect(promise).rejects.toThrow()
  })

  test('should return null if addAmount return null', async () => {
    const { sut, addAmountBuyBookStub } = makeSut()
    jest
      .spyOn(addAmountBuyBookStub, 'addAmount')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.updateAmount('any_token', 'any_book_id', 1)
    expect(response).toBeFalsy()
  })

  test('should return a book on success', async () => {
    const { sut } = makeSut()
    const response = await sut.updateAmount('any_token', 'any_book_id', 1)
    expect(response).toEqual(makeFakeAddBuyBook())
  })
})

export {}

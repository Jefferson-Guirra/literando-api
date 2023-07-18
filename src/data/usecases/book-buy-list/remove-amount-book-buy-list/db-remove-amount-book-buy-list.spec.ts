import {
  LoadAccountByAccessTokenRepository,
  accountLoginModel
} from '../../../protocols/db/account/load-account-by-access-token-repository'
import { DbRemoveAmountBookBuyList } from './db-remove-amount-book-buy-list'
import { AddBuyBookModel } from '../../../../domain/usecases/book-buy-list/add-book-buy-list'
import { RemoveAmountBuyBookRepository } from '../../../protocols/db/book-buy-list/remove-amount-book-buy-list'
import { LoadBuyBookByQueryDocRepository } from '../../../protocols/db/book-buy-list/load-book-buy-list-by-query-doc-repository'

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

const makeLoadBookStub = (): LoadBuyBookByQueryDocRepository => {
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

const makeRemoveAmountBookStub = (): RemoveAmountBuyBookRepository => {
  class RemoveAmountBuyBookRepositoryStub
  implements RemoveAmountBuyBookRepository {
    async removeAmountBook (
      book: AddBuyBookModel
    ): Promise<AddBuyBookModel | null> {
      return await Promise.resolve(makeFakeAddBuyBook())
    }
  }
  return new RemoveAmountBuyBookRepositoryStub()
}
interface SutTypes {
  removeAmountBuyBookStub: RemoveAmountBuyBookRepository
  loadBookStub: LoadBuyBookByQueryDocRepository
  loadAccountStub: LoadAccountByAccessTokenRepository
  sut: DbRemoveAmountBookBuyList
}

const makeSut = (): SutTypes => {
  const removeAmountBuyBookStub = makeRemoveAmountBookStub()
  const loadBookStub = makeLoadBookStub()
  const loadAccountStub = makeLoadAccountStub()
  const sut = new DbRemoveAmountBookBuyList(
    loadAccountStub,
    loadBookStub,
    removeAmountBuyBookStub
  )
  return {
    removeAmountBuyBookStub,
    loadBookStub,
    loadAccountStub,
    sut
  }
}
describe('DbRemoveAmountBookBuyList', () => {
  test('should call loadAccountByAccessToken wit correct token', async () => {
    const { sut, loadAccountStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountStub, 'loadByAccessToken')
    await sut.removeAmount('any_token', 'any_book_id')
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return throw if loadAccountByAccessToken return throw', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest
      .spyOn(loadAccountStub, 'loadByAccessToken')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.removeAmount('any_token', 'any_book_id')
    await expect(promise).rejects.toThrow()
  })

  test('should return undefined if loadAccountByAccessToken return null', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest
      .spyOn(loadAccountStub, 'loadByAccessToken')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.removeAmount('any_token', 'any_book_id')
    expect(response).toBeFalsy()
  })

  test('should call loadBook wit correct values', async () => {
    const { sut, loadBookStub } = makeSut()
    const loadBookSpy = jest.spyOn(loadBookStub, 'loadBookByQueryDoc')
    await sut.removeAmount('any_token', 'any_book_id')
    expect(loadBookSpy).toHaveBeenCalledWith('any_id', 'any_book_id')
  })

  test('should return undefined wit loadBook return null', async () => {
    const { sut, loadBookStub } = makeSut()
    jest
      .spyOn(loadBookStub, 'loadBookByQueryDoc')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.removeAmount('any_token', 'any_book_id')
    expect(response).toBeFalsy()
  })

  test('should return throw if loadBook return throw', async () => {
    const { sut, loadBookStub } = makeSut()
    jest
      .spyOn(loadBookStub, 'loadBookByQueryDoc')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.removeAmount('any_token', 'any_book_id')
    await expect(promise).rejects.toThrow()
  })

  test('should call removeAmountBuyBook wit correct book', async () => {
    const { sut, removeAmountBuyBookStub } = makeSut()
    const removeSpy = jest.spyOn(removeAmountBuyBookStub, 'removeAmountBook')
    await sut.removeAmount('any_token', 'any_book_id')
    expect(removeSpy).toHaveBeenCalledWith(makeFakeAddBuyBook())
  })

  test('should return throw if removeAmountBuyBook return throw', async () => {
    const { sut, removeAmountBuyBookStub } = makeSut()
    jest
      .spyOn(removeAmountBuyBookStub, 'removeAmountBook')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.removeAmount('any_token', 'any_book_id')
    await expect(promise).rejects.toThrow()
  })

  test('should return undefined if removeAmountBuyBook return null', async () => {
    const { sut, removeAmountBuyBookStub } = makeSut()
    jest
      .spyOn(removeAmountBuyBookStub, 'removeAmountBook')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.removeAmount('any_token', 'any_book_id')
    expect(response).toBeFalsy()
  })

  test('should return book  on success', async () => {
    const { sut } = makeSut()
    const response = await sut.removeAmount('any_token', 'any_book_id')
    expect(response).toEqual(makeFakeAddBuyBook())
  })
})

export {}

import { BookModel } from '../../../../domain/models/book/book'
import { AddBuyBookModel } from '../../../../domain/usecases/book-buy-list/add-book-buy-list'
import { AddBuyBookRepository } from '../../../protocols/db/book-buy-list/add-book-buy-list-repository'
import {
  LoadAccountByAccessTokenRepository,
  accountLoginModel
} from '../../../protocols/db/account/load-account-by-access-token-repository'
import { LoadBuyBookByQueryDocRepository } from '../../../protocols/db/book-buy-list/load-book-buy-list-by-query-doc-repository'
import { UpdateBuyBookRepository } from '../../../protocols/db/book-buy-list/update-book-buy-list-repository'
import { DbAddBookBuyList } from './db-add-book-buy-list'

const makeFakeAddBuyBook = (): AddBuyBookModel => ({
  authors: ['any_author'],
  description: 'any_description',
  pageCount: 1,
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

const makeFakeRequest = (): BookModel => ({
  accessToken: 'any_token',
  bookId: 'any_id',
  pageCount: 1,
  authors: ['any_author'],
  description: 'any_description',
  title: 'any_title',
  imgUrl: 'any_url',
  language: 'any_language',
  price: 0,
  publisher: 'any_publisher',
  publisherDate: 'any_date'
})

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

const makeUpdateBuyBookStub = (): UpdateBuyBookRepository => {
  class UpdateAmountBuyBookStub implements UpdateBuyBookRepository {
    async updateAmount (book: AddBuyBookModel): Promise<AddBuyBookModel | null> {
      return await Promise.resolve(makeFakeAddBuyBook())
    }
  }
  return new UpdateAmountBuyBookStub()
}

const makeAddBuyBookRepositoryStub = (): AddBuyBookRepository => {
  class AddBuyBookRepositoryStub implements AddBuyBookRepository {
    async addBook (
      book: BookModel,
      userId: string
    ): Promise<AddBuyBookModel | null> {
      return await Promise.resolve(makeFakeAddBuyBook())
    }
  }

  return new AddBuyBookRepositoryStub()
}
interface SutTypes {
  addBuyBookRepositoryStub: AddBuyBookRepository
  updateAmountBuyBookStub: UpdateBuyBookRepository
  loadBookByQueryDocRepositoryStub: LoadBuyBookByQueryDocRepository
  loadAccountRepositoryStub: LoadAccountByAccessTokenRepository
  sut: DbAddBookBuyList
}
const makeSut = (): SutTypes => {
  const addBuyBookRepositoryStub = makeAddBuyBookRepositoryStub()
  const updateAmountBuyBookStub = makeUpdateBuyBookStub()
  const loadBookByQueryDocRepositoryStub = makeLoadBookByQueryDocStub()
  const loadAccountRepositoryStub = makeLoadAccountRepositoryStub()
  const sut = new DbAddBookBuyList(
    loadAccountRepositoryStub,
    loadBookByQueryDocRepositoryStub,
    updateAmountBuyBookStub,
    addBuyBookRepositoryStub
  )
  return {
    addBuyBookRepositoryStub,
    updateAmountBuyBookStub,
    loadBookByQueryDocRepositoryStub,
    loadAccountRepositoryStub,
    sut
  }
}
describe('DbAddBookBuyList', () => {
  test('should DbAddBookBuyList call LoadAccount with correct value', async () => {
    const { loadAccountRepositoryStub, sut } = makeSut()
    const loadSpy = jest.spyOn(loadAccountRepositoryStub, 'loadByAccessToken')
    await sut.add(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return LoadAccount return null', async () => {
    const { loadAccountRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadAccountRepositoryStub, 'loadByAccessToken')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.add(makeFakeRequest())
    expect(response).toBeFalsy()
  })

  test('should return throw if LoadAccount return throw', async () => {
    const { loadAccountRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadAccountRepositoryStub, 'loadByAccessToken')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const response = sut.add(makeFakeRequest())
    await expect(response).rejects.toThrow()
  })

  test('should call LoadBookByQueryDoc with correct values', async () => {
    const { sut, loadBookByQueryDocRepositoryStub } = makeSut()
    const loadBookSpy = jest.spyOn(
      loadBookByQueryDocRepositoryStub,
      'loadBookByQueryDoc'
    )
    await sut.add(makeFakeRequest())
    expect(loadBookSpy).toBeCalledWith('any_user_id', 'any_id')
  })

  test('should return throw if LoadBookByQueryDoc return throw', async () => {
    const { sut, loadBookByQueryDocRepositoryStub } = makeSut()
    jest
      .spyOn(loadBookByQueryDocRepositoryStub, 'loadBookByQueryDoc')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(makeFakeRequest())
    await expect(promise).rejects.toThrow()
  })

  test('should call UpdateBook if LoadBook return a book', async () => {
    const { sut, updateAmountBuyBookStub } = makeSut()
    const updateAmountSpy = jest.spyOn(updateAmountBuyBookStub, 'updateAmount')
    await sut.add(makeFakeRequest())
    expect(updateAmountSpy).toHaveBeenCalledTimes(1)
  })

  test('should call UpdateBook if correct book value', async () => {
    const { sut, updateAmountBuyBookStub } = makeSut()
    const updateAmountSpy = jest.spyOn(updateAmountBuyBookStub, 'updateAmount')
    await sut.add(makeFakeRequest())
    expect(updateAmountSpy).toHaveBeenCalledWith(makeFakeAddBuyBook())
  })

  test('should return throw if UpdateBook return throw', async () => {
    const { sut, updateAmountBuyBookStub } = makeSut()
    jest
      .spyOn(updateAmountBuyBookStub, 'updateAmount')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(makeFakeRequest())
    await expect(promise).rejects.toThrow()
  })

  test('should call AddBook if LoadBook return null', async () => {
    const {
      sut,
      updateAmountBuyBookStub,
      loadBookByQueryDocRepositoryStub,
      addBuyBookRepositoryStub
    } = makeSut()
    jest
      .spyOn(loadBookByQueryDocRepositoryStub, 'loadBookByQueryDoc')
      .mockReturnValue(Promise.resolve(null))
    const updateAmountSpy = jest.spyOn(updateAmountBuyBookStub, 'updateAmount')
    const addBookSpy = jest.spyOn(addBuyBookRepositoryStub, 'addBook')
    await sut.add(makeFakeRequest())
    expect(updateAmountSpy).toHaveBeenCalledTimes(0)
    expect(addBookSpy).toHaveBeenCalledTimes(1)
  })

  test('should call AddBook with correct values', async () => {
    const { sut, addBuyBookRepositoryStub, loadBookByQueryDocRepositoryStub } =
      makeSut()
    jest
      .spyOn(loadBookByQueryDocRepositoryStub, 'loadBookByQueryDoc')
      .mockReturnValue(Promise.resolve(null))
    const addBookSpy = jest.spyOn(addBuyBookRepositoryStub, 'addBook')
    await sut.add(makeFakeRequest())
    expect(addBookSpy).toBeCalledWith(makeFakeRequest(), 'any_user_id')
  })

  test('should return throw if AddBook return throw', async () => {
    const { sut, addBuyBookRepositoryStub, loadBookByQueryDocRepositoryStub } =
      makeSut()
    jest
      .spyOn(loadBookByQueryDocRepositoryStub, 'loadBookByQueryDoc')
      .mockReturnValue(Promise.resolve(null))
    jest
      .spyOn(addBuyBookRepositoryStub, 'addBook')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(makeFakeRequest())
    await expect(promise).rejects.toThrow()
  })

  test('should return a book on succeeds', async () => {
    const { sut } = makeSut()
    const response = await sut.add(makeFakeRequest())
    expect(response).toEqual(makeFakeAddBuyBook())
  })
})
export {}

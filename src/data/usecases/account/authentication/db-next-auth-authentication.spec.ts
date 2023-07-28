import { AccountModel } from '../../../../domain/models/account/account'
import { nextAuthAuthenticationModel } from '../../../../domain/usecases/account/next-auth-authentication'
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository'
import { LoadPrivateRouteByNameRepository, PrivateRouteModel } from '../../../protocols/db/private-route/load-private-route-by-name-repository'
import { DbNextAuthAuthentication } from './db-next-auth-authentication'

const makeFakeAccount = (): AccountModel => ({
  username: 'any_username',
  email: 'any_email@mail.com',
  password: 'any_password',
  id: 'any_id'
})
const makeFakeRequest = (): nextAuthAuthenticationModel => ({
  routeName: 'any_name',
  privateKey: 'any_key',
  email: 'any_email@mail.com',
  accessToken: 'any_token'
})
const makeLoadPrivateRouteStub = (): LoadPrivateRouteByNameRepository => {
  class LoadPrivateRouteByNameRepositoryStub implements LoadPrivateRouteByNameRepository {
    async loadByRouteName (routeName: string): Promise<PrivateRouteModel | null> {
      return await Promise.resolve({ routeName: 'any_name', privateKey: 'any_key' })
    }
  }
  return new LoadPrivateRouteByNameRepositoryStub()
}

const makeLoadAccountRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel | null> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}
interface SutTypes {
  loadAccountStub: LoadAccountByEmailRepository
  loadPrivateRouteStub: LoadPrivateRouteByNameRepository
  sut: DbNextAuthAuthentication
}

const makeSut = (): SutTypes => {
  const loadAccountStub = makeLoadAccountRepositoryStub()
  const loadPrivateRouteStub = makeLoadPrivateRouteStub()
  const sut = new DbNextAuthAuthentication(loadPrivateRouteStub, loadAccountStub)
  return {
    loadAccountStub,
    loadPrivateRouteStub,
    sut
  }
}

describe('DbNextAuthAuthentication', () => {
  test('should call loadPrivateRoute with correct values', async () => {
    const { sut, loadPrivateRouteStub } = makeSut()
    const loadSpy = jest.spyOn(loadPrivateRouteStub, 'loadByRouteName')
    await sut.auth(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_name')
  })

  test('should return undefined if loadPrivateRoute return null', async () => {
    const { sut, loadPrivateRouteStub } = makeSut()
    jest.spyOn(loadPrivateRouteStub, 'loadByRouteName').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.auth(makeFakeRequest())
    expect(response).toEqual(undefined)
  })

  test('should return undefined if password provided invalid', async () => {
    const { sut, loadPrivateRouteStub } = makeSut()
    jest.spyOn(loadPrivateRouteStub, 'loadByRouteName').mockReturnValueOnce(Promise.resolve({
      routeName: 'any_name',
      privateKey: 'random_key'
    }))
    const response = await sut.auth(makeFakeRequest())
    expect(response).toEqual(undefined)
  })

  test('should return throw if loadPrivateRoute return throw', async () => {
    const { sut, loadPrivateRouteStub } = makeSut()
    jest.spyOn(loadPrivateRouteStub, 'loadByRouteName').mockReturnValueOnce(Promise.reject(new Error('')))
    const response = sut.auth(makeFakeRequest())
    await expect(response).rejects.toThrow()
  })

  test('should call loadAccount with correct email', async () => {
    const { sut, loadAccountStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountStub, 'loadByEmail')
    await sut.auth(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return undefined if loadAccount return null', async () => {
    const { loadAccountStub, sut } = makeSut()
    jest.spyOn(loadAccountStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.auth(makeFakeRequest())
    expect(response).toEqual(undefined)
  })

  test('should return thro if loadAccount return throw', async () => {
    const { loadAccountStub, sut } = makeSut()
    jest.spyOn(loadAccountStub, 'loadByEmail').mockReturnValueOnce(Promise.reject(new Error('')))
    const response = sut.auth(makeFakeRequest())
    await expect(response).rejects.toThrow()
  })
})

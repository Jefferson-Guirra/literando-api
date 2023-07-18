import {
  LoadAccountByAccessTokenRepository,
  accountLoginModel
} from '../../../protocols/db/account/load-account-by-access-token-repository'
import { RemoveAccessTokenRepository } from '../../../protocols/db/account/remove-access-token-repository'
import { DbLogoutAccount } from './logout-account'

const makeFakeAccount = (): accountLoginModel => {
  return {
    username: 'any_username',
    password: 'any_password',
    email: 'any_email@mail.com',
    id: 'any_id',
    accessToken: 'any_token'
  }
}
const makeLoadAccountByAccessTokenStub =
  (): LoadAccountByAccessTokenRepository => {
    class LoadAccountByAccessTokenStub
    implements LoadAccountByAccessTokenRepository {
      async loadByAccessToken (
        accessToken: string
      ): Promise<accountLoginModel | null> {
        return await Promise.resolve(makeFakeAccount())
      }
    }
    return new LoadAccountByAccessTokenStub()
  }

const makeRemoveAccessTokenStub = (): RemoveAccessTokenRepository => {
  class RemoveAccessTokenStub implements RemoveAccessTokenRepository {
    async remove (accessToken: string): Promise<void> {
      await Promise.resolve(null)
    }
  }
  return new RemoveAccessTokenStub()
}
interface SutTypes {
  loadAccountByAccessTokenStub: LoadAccountByAccessTokenRepository
  removeAccessTokenStub: RemoveAccessTokenRepository
  sut: DbLogoutAccount
}
const makeSut = (): SutTypes => {
  const loadAccountByAccessTokenStub = makeLoadAccountByAccessTokenStub()
  const removeAccessTokenStub = makeRemoveAccessTokenStub()
  const sut = new DbLogoutAccount(
    loadAccountByAccessTokenStub,
    removeAccessTokenStub
  )
  return {
    loadAccountByAccessTokenStub,
    removeAccessTokenStub,
    sut
  }
}
describe('DbLogoutAccount', () => {
  test('should call load with correct token', async () => {
    const { sut, loadAccountByAccessTokenStub } = makeSut()
    const loadSpy = jest.spyOn(
      loadAccountByAccessTokenStub,
      'loadByAccessToken'
    )
    await sut.logout('any_token')
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return undefined if load return null', async () => {
    const { sut, loadAccountByAccessTokenStub } = makeSut()
    jest
      .spyOn(loadAccountByAccessTokenStub, 'loadByAccessToken')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.logout('any_token')
    expect(response).toBeFalsy()
  })

  test('should return throw if load return throw', async () => {
    const { sut, loadAccountByAccessTokenStub } = makeSut()
    jest
      .spyOn(loadAccountByAccessTokenStub, 'loadByAccessToken')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.logout('any_token')
    await expect(promise).rejects.toThrow()
  })

  test('should call remove with correct token', async () => {
    const { removeAccessTokenStub, sut } = makeSut()
    const removeSpy = jest.spyOn(removeAccessTokenStub, 'remove')
    await sut.logout('any_token')
    expect(removeSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return throw if remove return throw', async () => {
    const { sut, removeAccessTokenStub } = makeSut()
    jest
      .spyOn(removeAccessTokenStub, 'remove')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.logout('any_token')
    await expect(promise).rejects.toThrow()
  })

  test('should return message on a succeeds', async () => {
    const { sut } = makeSut()
    const response = await sut.logout('any_token')
    expect(response).toEqual('logout success')
  })
})

export {}

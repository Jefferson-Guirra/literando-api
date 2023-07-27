import { AddNextAuthAccountModel } from '../../../../domain/usecases/account/add-next-auth-account'
import { LoadAccountByAccessTokenRepository, accountLoginModel } from '../../../protocols/db/account/load-account-by-access-token-repository'
import { DbNextAuthAddAccount } from './db-add-next-auth-account'

const makeFakeAccount = (): accountLoginModel => ({
  email: 'any_mail@email.com',
  accessToken: 'any_token',
  password: 'hashed_password',
  username: 'any_name',
  id: 'any_id'
})

const makeFakeRequest = (): AddNextAuthAccountModel => ({
  email: 'any_mail@email.com',
  accessToken: 'any_token',
  username: 'any_name'
})

const makeLoadAccountRepositoryStub = (): LoadAccountByAccessTokenRepository => {
  class LoadAccountByAccessTokenRepositoryStub implements LoadAccountByAccessTokenRepository {
    async loadByAccessToken (accessToken: string): Promise<accountLoginModel | null> {
      return await Promise.resolve(null)
    }
  }
  return new LoadAccountByAccessTokenRepositoryStub()
}

interface SutTypes {
  loadAccountStub: LoadAccountByAccessTokenRepository
  sut: DbNextAuthAddAccount
}

const makeSut = (): SutTypes => {
  const loadAccountStub = makeLoadAccountRepositoryStub()
  const sut = new DbNextAuthAddAccount(loadAccountStub)

  return {
    loadAccountStub,
    sut
  }
}

describe('DbNextAuthAddAccount', () => {
  test('should call loadAccount with correct values', async () => {
    const { sut, loadAccountStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountStub, 'loadByAccessToken')
    await sut.add(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
  test('should return null if account exist', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest.spyOn(loadAccountStub, 'loadByAccessToken').mockReturnValueOnce(Promise.resolve(makeFakeAccount()))
    const response = await sut.add(makeFakeRequest())
    expect(response).toBeFalsy()
  })
})

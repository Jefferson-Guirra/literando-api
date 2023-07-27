import { NextAuthAccount } from '../../../../domain/models/account/next-auth-account'
import { LoadAccountByAccessTokenRepository, accountLoginModel } from '../../../protocols/db/account/load-account-by-access-token-repository'
import { DbNextAuthAddAccount } from './db-add-next-auth-account'

const makeFakeRequest = (): NextAuthAccount => ({
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
})

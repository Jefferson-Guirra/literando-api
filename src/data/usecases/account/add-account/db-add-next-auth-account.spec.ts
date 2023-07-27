import { AccountModel } from '../../../../domain/models/account/account'
import { AddNextAuthAccountModel } from '../../../../domain/usecases/account/add-next-auth-account'
import { accountLoginModel } from '../../../protocols/db/account/load-account-by-access-token-repository'
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository'
import { DbNextAuthAddAccount } from './db-add-next-auth-account'

const makeFakeAccount = (): accountLoginModel => ({
  email: 'any_email@mail.com',
  accessToken: 'any_token',
  password: 'hashed_password',
  username: 'any_name',
  id: 'any_id'
})

const makeFakeRequest = (): AddNextAuthAccountModel => ({
  email: 'any_email@mail.com',
  accessToken: 'any_token',
  username: 'any_name'
})

const makeLoadAccountRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel | null> {
      return await Promise.resolve(null)
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  loadAccountStub: LoadAccountByEmailRepository
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
    const loadSpy = jest.spyOn(loadAccountStub, 'loadByEmail')
    await sut.add(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return null if account exist', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest.spyOn(loadAccountStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(makeFakeAccount()))
    const response = await sut.add(makeFakeRequest())
    expect(response).toBeFalsy()
  })
})

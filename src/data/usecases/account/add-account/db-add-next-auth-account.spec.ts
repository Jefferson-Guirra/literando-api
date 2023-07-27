import { AccountModel } from '../../../../domain/models/account/account'
import { NextAuthAccount } from '../../../../domain/models/account/next-auth-account'
import { AddNextAuthAccountModel } from '../../../../domain/usecases/account/add-next-auth-account'
import { AddNextAuthAccountRepository } from '../../../protocols/db/account/add-next-auth-account-repository'
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository'
import { DbNextAuthAddAccount } from './db-add-next-auth-account'

const makeFakeAccount = (): NextAuthAccount => ({
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

const makeAddAccountStub = (): AddNextAuthAccountRepository => {
  class AddAccountRepositoryStub implements AddNextAuthAccountRepository {
    async addNextAuthAccount (account: AddNextAuthAccountModel): Promise<NextAuthAccount | null> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new AddAccountRepositoryStub()
}

interface SutTypes {
  loadAccountStub: LoadAccountByEmailRepository
  addAccountRepositoryStub: AddNextAuthAccountRepository
  sut: DbNextAuthAddAccount
}

const makeSut = (): SutTypes => {
  const loadAccountStub = makeLoadAccountRepositoryStub()
  const addAccountRepositoryStub = makeAddAccountStub()
  const sut = new DbNextAuthAddAccount(loadAccountStub, addAccountRepositoryStub)

  return {
    loadAccountStub,
    addAccountRepositoryStub,
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

  test('should return throw if load account fails', async () => {
    const { loadAccountStub, sut } = makeSut()
    jest.spyOn(loadAccountStub, 'loadByEmail').mockReturnValueOnce(Promise.reject(new Error('')))
    const promise = sut.add(makeFakeRequest())
    await expect(promise).rejects.toThrow()
  })

  test('should call addAccount with correct values)', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'addNextAuthAccount')
    await sut.add(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith(makeFakeRequest())
  })
})

import { AccountModel } from '../../../../domain/models/account/account'
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository'
import { DbREsetPasswordEmail } from './db-reset--password-email'

const makeLoadAccountStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel | null> {
      return await Promise.resolve({
        username: 'any_username',
        email: 'any_password',
        password: 'hashed_password',
        id: 'any_id'
      })
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}
interface SUtTypes {
  loadAccountStub: LoadAccountByEmailRepository
  sut: DbREsetPasswordEmail
}

const makeSut = (): SUtTypes => {
  const loadAccountStub = makeLoadAccountStub()
  const sut = new DbREsetPasswordEmail(loadAccountStub)
  return {
    loadAccountStub,
    sut
  }
}

describe('DbREsetPasswordEmail', () => {
  test('should call loadAccountStub with correct email', async () => {
    const { sut, loadAccountStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountStub, 'loadByEmail')
    await sut.reset('any_email@mail.com')
    expect(loadSpy).toBeCalledWith('any_email@mail.com')
  })
})

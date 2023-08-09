import { LoadResetPasswordRequestByAccessTokenRepository } from '../../../protocols/db/email/load-reset-password-request-by-access-token-repository'
import { ResetPasswordRequestModel } from '../../../protocols/db/email/load-reset-password-request-by-email-repository'
import { DbResetPasswordAccount } from './db-reset-password-account'

const makeLoadRequestStub = (): LoadResetPasswordRequestByAccessTokenRepository => {
  class LoadResetPasswordRequestByAccessTokenStub implements LoadResetPasswordRequestByAccessTokenRepository {
    async loadRequestByAccessToken (accessToken: string): Promise<ResetPasswordRequestModel | null> {
      return await Promise.resolve({
        id: 'any_id',
        email: 'any_email@mail.com',
        accessToken: 'any_token'
      })
    }
  }
  return new LoadResetPasswordRequestByAccessTokenStub()
}

interface SutTypes {
  loadRequestStub: LoadResetPasswordRequestByAccessTokenRepository
  sut: DbResetPasswordAccount
}

const makeSut = (): SutTypes => {
  const loadRequestStub = makeLoadRequestStub()
  const sut = new DbResetPasswordAccount(loadRequestStub)
  return {
    loadRequestStub,
    sut
  }
}

describe('DbResetPasswordAccount', () => {
  test('should call loadRequest with correct value', async () => {
    const { sut, loadRequestStub } = makeSut()
    const loadRequestSpy = jest.spyOn(loadRequestStub, 'loadRequestByAccessToken')
    await sut.resetPassword('any_token', 'any_password')
    expect(loadRequestSpy).toHaveBeenCalledWith('any_token')
  })
})

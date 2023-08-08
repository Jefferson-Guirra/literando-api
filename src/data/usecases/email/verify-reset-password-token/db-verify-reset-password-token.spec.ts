import { LoadResetPasswordRequestByAccessTokenRepository } from '../../../protocols/db/email/load-reset-password-request-by-access-token'
import { ResetPasswordRequestModel } from '../../../protocols/db/email/load-reset-password-request-by-email-repository'
import { DbVerifyResetPasswordToken } from './db-verify-reset-password-token'

const makeLoadRequestByAccessTokenStub = (): LoadResetPasswordRequestByAccessTokenRepository => {
  class LoadResetPasswordRequestByAccessTokenRepositoryStub implements LoadResetPasswordRequestByAccessTokenRepository {
    async loadRequestByAccessToken (accessToken: string): Promise<ResetPasswordRequestModel | null> {
      return await Promise.resolve({
        id: 'any_id',
        email: 'any_email@mail.com',
        accessToken: 'any_token'
      })
    }
  }
  return new LoadResetPasswordRequestByAccessTokenRepositoryStub()
}
interface SutTypes {
  loadRequestByAccessTokenStub: LoadResetPasswordRequestByAccessTokenRepository
  sut: DbVerifyResetPasswordToken
}

const makeSut = (): SutTypes => {
  const loadRequestByAccessTokenStub = makeLoadRequestByAccessTokenStub()
  const sut = new DbVerifyResetPasswordToken(loadRequestByAccessTokenStub)
  return {
    loadRequestByAccessTokenStub,
    sut
  }
}

describe('DbVerifyResetPasswordToken', () => {
  test('should call loadRequestBeyAccessToken with correct token', async () => {
    const { sut, loadRequestByAccessTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadRequestByAccessTokenStub, 'loadRequestByAccessToken')
    await sut.verifyResetPasswordToken('any_token')
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})

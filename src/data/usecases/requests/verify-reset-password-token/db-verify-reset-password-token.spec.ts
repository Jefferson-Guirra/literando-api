import { LoadResetPasswordRequestByAccessTokenRepository } from '../../../protocols/db/reset-password-request/load-reset-password-request-by-access-token-repository'
import { ResetPasswordRequestModel } from '../../../protocols/db/reset-password-request/load-reset-password-request-by-email-repository'
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
  test('should return throw if loadRequestBeyAccessToken fails', async () => {
    const { sut, loadRequestByAccessTokenStub } = makeSut()
    jest.spyOn(loadRequestByAccessTokenStub, 'loadRequestByAccessToken').mockReturnValueOnce(Promise.reject(new Error('')))
    const promise = sut.verifyResetPasswordToken('any_token')
    await expect(promise).rejects.toThrow()
  })
  test('should return false if loadRequestBeyAccessToken return null', async () => {
    const { sut, loadRequestByAccessTokenStub } = makeSut()
    jest.spyOn(loadRequestByAccessTokenStub, 'loadRequestByAccessToken').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.verifyResetPasswordToken('any_token')
    expect(response).toEqual(false)
  })
  test('should return true on success', async () => {
    const { sut } = makeSut()
    const response = await sut.verifyResetPasswordToken('any_token')
    expect(response).toEqual(true)
  })
})

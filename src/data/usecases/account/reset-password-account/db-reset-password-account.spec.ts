import { Hasher } from '../../../protocols/criptography/hasher'
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

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }
  return new HasherStub()
}

interface SutTypes {
  hasherStub: Hasher
  loadRequestStub: LoadResetPasswordRequestByAccessTokenRepository
  sut: DbResetPasswordAccount
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasherStub()
  const loadRequestStub = makeLoadRequestStub()
  const sut = new DbResetPasswordAccount(loadRequestStub, hasherStub)
  return {
    hasherStub,
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
  test('should return null if loadRequest return null', async () => {
    const { sut, loadRequestStub } = makeSut()
    jest.spyOn(loadRequestStub, 'loadRequestByAccessToken').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.resetPassword('any_token', 'any_password')
    expect(response).toBeFalsy()
  })
  test('should return throw if loadRequest fails', async () => {
    const { sut, loadRequestStub } = makeSut()
    jest.spyOn(loadRequestStub, 'loadRequestByAccessToken').mockReturnValueOnce(Promise.reject(new Error('')))
    const promise = sut.resetPassword('any_token', 'any_password')
    await expect(promise).rejects.toThrow()
  })
  test('should call hasher with correct value', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.resetPassword('any_token', 'any_password')
    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })
})

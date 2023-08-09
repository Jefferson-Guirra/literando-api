import { Hasher } from '../../../protocols/criptography/hasher'
import { ResetPasswordAccountModel, ResetPasswordAccountRepository } from '../../../protocols/db/account/reset-password-account-repository'
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
const makeResetPasswordAccountRepositoryStub = (): ResetPasswordAccountRepository => {
  class ResetPasswordAccountRepositoryStub implements ResetPasswordAccountRepository {
    async resetPassword (email: string, password: string): Promise<ResetPasswordAccountModel | null> {
      return await Promise.resolve({
        id: 'any_id',
        username: 'any_username',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token'
      })
    }
  }
  return new ResetPasswordAccountRepositoryStub()
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
  resetPasswordAccountRepositoryStub: ResetPasswordAccountRepository
  hasherStub: Hasher
  loadRequestStub: LoadResetPasswordRequestByAccessTokenRepository
  sut: DbResetPasswordAccount
}

const makeSut = (): SutTypes => {
  const resetPasswordAccountRepositoryStub = makeResetPasswordAccountRepositoryStub()
  const hasherStub = makeHasherStub()
  const loadRequestStub = makeLoadRequestStub()
  const sut = new DbResetPasswordAccount(loadRequestStub, hasherStub, resetPasswordAccountRepositoryStub)
  return {
    resetPasswordAccountRepositoryStub,
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
  test('should return throw if hasher fails', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error('')))
    const promise = sut.resetPassword('any_token', 'any_password')
    await expect(promise).rejects.toThrow()
  })
  test('should call ResetPasswordAccount with correct values', async () => {
    const { sut, resetPasswordAccountRepositoryStub } = makeSut()
    const resetSpy = jest.spyOn(resetPasswordAccountRepositoryStub, 'resetPassword')
    await sut.resetPassword('any_token', 'any_password')
    expect(resetSpy).toHaveBeenCalledWith('any_email@mail.com', 'hashed_password')
  })
  test('should return throw if ResetPasswordAccount fails', async () => {
    const { sut, resetPasswordAccountRepositoryStub } = makeSut()
    jest.spyOn(resetPasswordAccountRepositoryStub, 'resetPassword').mockReturnValueOnce(Promise.reject(new Error('')))
    const promise = sut.resetPassword('any_token', 'any_password')
    await expect(promise).rejects.toThrow()
  })
})

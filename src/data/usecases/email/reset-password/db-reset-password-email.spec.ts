import { AccountModel } from '../../../../domain/models/account/account'
import { Encrypter } from '../../../protocols/criptography/encrypter'
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository'
import { GetResetPasswordRequestRepository, ResetPasswordRequestModel } from '../../../protocols/db/email/get-reset-password-request-repository'
import { UpdateResetPasswordTokenRepository } from '../../../protocols/db/email/update-reset-password-token-repository'
import { SendMessage } from '../../../protocols/email/send-message'
import { DbResetPasswordEmail } from './db-reset-password-email'

const makeUpdateResetPasswordTokenStub = (): UpdateResetPasswordTokenRepository => {
  class UpdateResetPasswordTokenRepositoryStub implements UpdateResetPasswordTokenRepository {
    async update (email: string, accessToken: string): Promise<ResetPasswordRequestModel | null> {
      return await Promise.resolve({
        id: 'any_id',
        email: 'any_email@mail.com',
        accessToken: 'any_token'
      })
    }
  }
  return new UpdateResetPasswordTokenRepositoryStub()
}

const makeGetRequestStub = (): GetResetPasswordRequestRepository => {
  class GetResetRequestStub implements GetResetPasswordRequestRepository {
    async find (email: string): Promise<ResetPasswordRequestModel | null> {
      return await Promise.resolve({
        id: 'any_id',
        email: 'any_email@mail.com',
        accessToken: 'any_token'
      })
    }
  }
  return new GetResetRequestStub()
}
const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('hashed_token')
    }
  }
  return new EncrypterStub()
}
const makeSendMessageStub = (): SendMessage => {
  class SendMessageStub implements SendMessage {
    async sendEmail (email: string): Promise<void> {
    }
  }
  return new SendMessageStub()
}

const makeLoadAccountStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel | null> {
      return await Promise.resolve({
        username: 'any_username',
        email: 'any_email@mail.com',
        password: 'hashed_password',
        id: 'any_id'
      })
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}
interface SUtTypes {
  updateResetPasswordTokenStub: UpdateResetPasswordTokenRepository
  getResetPasswordRequestStub: GetResetPasswordRequestRepository
  encrypterStub: Encrypter
  sendMessageStub: SendMessage
  loadAccountStub: LoadAccountByEmailRepository
  sut: DbResetPasswordEmail
}

const makeSut = (): SUtTypes => {
  const updateResetPasswordTokenStub = makeUpdateResetPasswordTokenStub()
  const getResetPasswordRequestStub = makeGetRequestStub()
  const encrypterStub = makeEncrypterStub()
  const sendMessageStub = makeSendMessageStub()
  const loadAccountStub = makeLoadAccountStub()
  const sut = new DbResetPasswordEmail(
    loadAccountStub, sendMessageStub,
    encrypterStub,
    getResetPasswordRequestStub,
    updateResetPasswordTokenStub
  )
  return {
    updateResetPasswordTokenStub,
    getResetPasswordRequestStub,
    encrypterStub,
    sendMessageStub,
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
  test('should return throw if loadAccount fails', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest.spyOn(loadAccountStub, 'loadByEmail').mockReturnValueOnce(Promise.reject(new Error('')))
    const promise = sut.reset('any_email@mail.com')
    await expect(promise).rejects.toThrow()
  })
  test('should return null if loadAccount return null', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest.spyOn(loadAccountStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.reset('any_email@mail.com')
    expect(response).toBeFalsy()
  })
  test('should call encrypter with correct value', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.reset('any_email@mail.com')
    expect(encryptSpy).toBeCalledWith('any_id')
  })
  test('should return throw if encrypter fails', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error('')))
    const promise = sut.reset('any_email@mail.com')
    await expect(promise).rejects.toThrow()
  })
  test('should call GetResetPasswordRequest with correct email', async () => {
    const { sut, getResetPasswordRequestStub } = makeSut()
    const findSpy = jest.spyOn(getResetPasswordRequestStub, 'find')
    await sut.reset('any_email@mail.com')
    expect(findSpy).toBeCalledWith('any_email@mail.com')
  })
  test('should  call updateResetPasswordTokenRepository with correct email', async () => {
    const { sut, updateResetPasswordTokenStub } = makeSut()
    const updateSpy = jest.spyOn(updateResetPasswordTokenStub, 'update')
    await sut.reset('any_email@mail.com')
    expect(updateSpy).toBeCalledWith('any_email@mail.com', 'hashed_token')
  })
  test('should return throw updateResetPasswordTokenRepository fails', async () => {
    const { sut, updateResetPasswordTokenStub } = makeSut()
    jest.spyOn(updateResetPasswordTokenStub, 'update').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.reset('any_email@mail.com')
    await expect(promise).rejects.toThrow()
  })
  test('should call sendMessage with correct email', async () => {
    const { sut, sendMessageStub } = makeSut()
    const sendEmailSpy = jest.spyOn(sendMessageStub, 'sendEmail')
    await sut.reset('any_email@mail.com')
    expect(sendEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  test('should return throw if sendMessage return throw', async () => {
    const { sut, sendMessageStub } = makeSut()
    jest.spyOn(sendMessageStub, 'sendEmail').mockReturnValueOnce(Promise.reject(new Error('')))
    const promise = sut.reset('any_email@mail.com')
    await expect(promise).rejects.toThrow()
  })
  test('should return data account on success', async () => {
    const { sut } = makeSut()
    const response = await sut.reset('any_email@mail.com')
    expect(response).toEqual({ email: 'any_email@mail.com', id: 'any_id' })
  })
})

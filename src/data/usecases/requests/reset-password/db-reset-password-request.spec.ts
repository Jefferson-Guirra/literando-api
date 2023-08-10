import { AccountModel } from '../../../../domain/models/account/account'
import { Encrypter } from '../../../protocols/criptography/encrypter'
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository'
import { AddRequestRepository } from '../../../protocols/db/requests/add-request-repository'
import { LoadRequestByEmailRepository, ResetPasswordRequestModel } from '../../../protocols/db/requests/load-request-by-email-repository'
import { UpdateResetPasswordTokenRepository } from '../../../protocols/db/requests/update-reset-password-token-repository'
import { SendResetPasswordMessage } from '../../../protocols/email/send-reset-password-message'
import { DbResetPasswordRequest } from './db-reset-password-request'

const makeRequestStub = (): ResetPasswordRequestModel => ({
  id: 'any_id',
  email: 'any_email@mail.com',
  accessToken: 'any_token'
})

const makeAddRequestStub = (): AddRequestRepository => {
  class AddResetPasswordRequestRepositoryStub implements AddRequestRepository {
    async add (email: string, accessToken: string): Promise<ResetPasswordRequestModel | null> {
      return await Promise.resolve(makeRequestStub())
    }
  }
  return new AddResetPasswordRequestRepositoryStub()
}

const makeUpdateResetPasswordTokenStub = (): UpdateResetPasswordTokenRepository => {
  class UpdateResetPasswordTokenRepositoryStub implements UpdateResetPasswordTokenRepository {
    async update (email: string, accessToken: string): Promise<ResetPasswordRequestModel | null> {
      return await Promise.resolve(makeRequestStub())
    }
  }
  return new UpdateResetPasswordTokenRepositoryStub()
}

const makeLoadRequestStub = (): LoadRequestByEmailRepository => {
  class LoadRequestByEmailRepositoryStub implements LoadRequestByEmailRepository {
    async loadRequestByEmail (email: string): Promise<ResetPasswordRequestModel | null> {
      return await Promise.resolve(makeRequestStub())
    }
  }
  return new LoadRequestByEmailRepositoryStub()
}
const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('hashed_token')
    }
  }
  return new EncrypterStub()
}
const makeSendMessageStub = (): SendResetPasswordMessage => {
  class SendMessageStub implements SendResetPasswordMessage {
    async sendResetPasswordEmail (email: string): Promise<void> {
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
  addResetPasswordRequestStub: AddRequestRepository
  updateResetPasswordTokenStub: UpdateResetPasswordTokenRepository
  loadRequestStub: LoadRequestByEmailRepository
  encrypterStub: Encrypter
  sendMessageStub: SendResetPasswordMessage
  loadAccountStub: LoadAccountByEmailRepository
  sut: DbResetPasswordRequest
}

const makeSut = (): SUtTypes => {
  const addResetPasswordRequestStub = makeAddRequestStub()
  const updateResetPasswordTokenStub = makeUpdateResetPasswordTokenStub()
  const loadRequestStub = makeLoadRequestStub()
  const encrypterStub = makeEncrypterStub()
  const sendMessageStub = makeSendMessageStub()
  const loadAccountStub = makeLoadAccountStub()
  const sut = new DbResetPasswordRequest(
    loadAccountStub, sendMessageStub,
    encrypterStub,
    loadRequestStub,
    updateResetPasswordTokenStub,
    addResetPasswordRequestStub
  )
  return {
    addResetPasswordRequestStub,
    updateResetPasswordTokenStub,
    loadRequestStub,
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
    const { sut, loadRequestStub } = makeSut()
    const findSpy = jest.spyOn(loadRequestStub, 'loadRequestByEmail')
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
  test('should call addResetPasswordRequest with correct values', async () => {
    const { sut, addResetPasswordRequestStub, loadRequestStub } = makeSut()
    jest.spyOn(loadRequestStub, 'loadRequestByEmail').mockReturnValueOnce(Promise.resolve(null))
    const addSpy = jest.spyOn(addResetPasswordRequestStub, 'add')
    await sut.reset('any_email@mail.com')
    expect(addSpy).toBeCalledWith('any_email@mail.com', 'hashed_token')
  })
  test('should call sendMessage with correct values', async () => {
    const { sut, sendMessageStub } = makeSut()
    const sendEmailSpy = jest.spyOn(sendMessageStub, 'sendResetPasswordEmail')
    await sut.reset('any_email@mail.com')
    expect(sendEmailSpy).toHaveBeenCalledWith('any_email@mail.com', 'any_username', 'any_token')
  })
  test('should return throw if sendMessage return throw', async () => {
    const { sut, sendMessageStub } = makeSut()
    jest.spyOn(sendMessageStub, 'sendResetPasswordEmail').mockReturnValueOnce(Promise.reject(new Error('')))
    const promise = sut.reset('any_email@mail.com')
    await expect(promise).rejects.toThrow()
  })
  test('should return data account on success', async () => {
    const { sut } = makeSut()
    const response = await sut.reset('any_email@mail.com')
    expect(response).toEqual({ email: 'any_email@mail.com', id: 'any_id', accessToken: 'any_token' })
  })
})

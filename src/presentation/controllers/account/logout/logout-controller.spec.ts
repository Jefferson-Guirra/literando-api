import { HttpRequest } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'
import { LogoutController } from './logout-controller'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '../../../helpers/http/http'
import { MissingParamError } from '../../../errors/missing-params-error'
import { AccountLogout } from '../../../../domain/usecases/account/logout-account'

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validation (input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      accessToken: 'any_token'
    }
  }
}

const makeAccountLogoutStub = (): AccountLogout => {
  class AccountLogoutStub implements AccountLogout {
    async logout (accessToken: string): Promise<string | undefined> {
      return await Promise.resolve('logout success')
    }
  }

  return new AccountLogoutStub()
}
interface SutTypes {
  validateStub: Validation
  accountLogoutStub: AccountLogout
  sut: LogoutController
}

const makeSut = (): SutTypes => {
  const validateStub = makeValidationStub()
  const accountLogoutStub = makeAccountLogoutStub()
  const sut = new LogoutController(validateStub, accountLogoutStub)
  return {
    validateStub,
    accountLogoutStub,
    sut
  }
}

describe('LoginController', () => {
  test('should call Validation with correct value', async () => {
    const { sut, validateStub } = makeSut()
    const validateSpy = jest.spyOn(validateStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('should return 400 if validation return error', async () => {
    const { sut, validateStub } = makeSut()
    jest
      .spyOn(validateStub, 'validation')
      .mockReturnValueOnce(new MissingParamError('any_field'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('should return 500 if validation return throw', async () => {
    const { sut, validateStub } = makeSut()
    jest.spyOn(validateStub, 'validation').mockImplementationOnce(() => {
      throw new Error()
    })
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('should call accountLogout with correct token', async () => {
    const { sut, accountLogoutStub } = makeSut()
    const logoutSpy = jest.spyOn(accountLogoutStub, 'logout')
    await sut.handle(makeFakeRequest())
    expect(logoutSpy).toHaveBeenLastCalledWith('any_token')
  })

  test('should return 400 if logout fails', async () => {
    const { sut, accountLogoutStub } = makeSut()
    jest
      .spyOn(accountLogoutStub, 'logout')
      .mockReturnValueOnce(Promise.resolve(undefined))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
  })

  test('should return 500 if logout return throw', async () => {
    const { sut, accountLogoutStub } = makeSut()
    jest
      .spyOn(accountLogoutStub, 'logout')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError())
  })
  test('should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(ok('logout success'))
  })
})

export {}

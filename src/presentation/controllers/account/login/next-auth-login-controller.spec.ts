import { NextAuth, NextAuthAuthentication, nextAuthAuthenticationModel } from '../../../../domain/usecases/account/next-auth-authentication'
import { MissingParamError } from '../../../errors/missing-params-error'
import { badRequest, unauthorized } from '../../../helpers/http/http'
import { HttpRequest } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'
import { NextAuthLoginController } from './next-auth-login-controller'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    routeName: 'any_name',
    privateKey: 'any_key',
    email: 'any_email@mail.com',
    accessToken: 'any_token'
  }
})

const makeValidatorStub = (): Validation => {
  class ValidatorStub implements Validation {
    validation (input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidatorStub()
}

const makeAuthenticationStub = (): NextAuthAuthentication => {
  class NextAuthAuthenticationStub implements NextAuthAuthentication {
    async auth (data: nextAuthAuthenticationModel): Promise<NextAuth | null | undefined> {
      return await Promise.resolve({ accessToken: 'any_token', username: 'any_username' })
    }
  }
  return new NextAuthAuthenticationStub()
}
interface SutTypes {
  validatorStub: Validation
  authenticationStub: NextAuthAuthentication
  sut: NextAuthLoginController
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthenticationStub()
  const validatorStub = makeValidatorStub()
  const sut = new NextAuthLoginController(validatorStub, authenticationStub)
  return {
    authenticationStub,
    validatorStub,
    sut
  }
}

describe('NextAuthLoginController', () => {
  test('should call validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validationSpy = jest.spyOn(validatorStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validationSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('should return 400 if validator return a error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validation').mockReturnValueOnce(new MissingParamError('any_field'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('should call authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })

  test('should return 401 if authentication fails', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(undefined))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
  })
})

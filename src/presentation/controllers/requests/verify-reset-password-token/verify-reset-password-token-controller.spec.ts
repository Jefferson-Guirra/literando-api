import { VerifyResetPasswordToken } from '../../../../domain/usecases/email/verify-reset-password-token'
import { MissingParamError } from '../../../errors/missing-params-error'
import { badRequest, ok, serverError, unauthorized } from '../../../helpers/http/http'
import { HttpRequest } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'
import { VerifyResetPasswordTokenController } from './verify-reset-password-token-controller'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    accessToken: 'any_token'
  }
})

const makeVerifyTokenStub = (): VerifyResetPasswordToken => {
  class VerifyResetPasswordTokenStub implements VerifyResetPasswordToken {
    async verifyResetPasswordToken (accessToken: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new VerifyResetPasswordTokenStub()
}
const makeValidatorStub = (): Validation => {
  class ValidatorStub implements Validation {
    validation (input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidatorStub()
}

interface SutTypes {
  verifyTokenStub: VerifyResetPasswordToken
  validatorStub: Validation
  sut: VerifyResetPasswordTokenController
}

const makeSut = (): SutTypes => {
  const verifyTokenStub = makeVerifyTokenStub()
  const validatorStub = makeValidatorStub()
  const sut = new VerifyResetPasswordTokenController(validatorStub, verifyTokenStub)
  return {
    verifyTokenStub,
    validatorStub,
    sut
  }
}

describe('VerifyResetPasswordTokenController', () => {
  test('should call validator with correct value', async () => {
    const { sut, validatorStub } = makeSut()
    const validatorSpy = jest.spyOn(validatorStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validatorSpy).toHaveBeenCalledWith(makeFakeRequest())
  })
  test('should return 400 if validator return error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validation').mockReturnValueOnce(new MissingParamError('any_field'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })
  test('should call verifyResetPasswordToken with correct token', async () => {
    const { sut, verifyTokenStub } = makeSut()
    const verifySpy = jest.spyOn(verifyTokenStub, 'verifyResetPasswordToken')
    await sut.handle(makeFakeRequest())
    expect(verifySpy).toHaveBeenCalledWith('any_token')
  })
  test('should return 401 if verifyResetPasswordToken return false', async () => {
    const { sut, verifyTokenStub } = makeSut()
    jest.spyOn(verifyTokenStub, 'verifyResetPasswordToken').mockReturnValueOnce(Promise.resolve(false))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
  })
  test('should return 500 if verifyResetPasswordToken fails', async () => {
    const { sut, verifyTokenStub } = makeSut()
    jest.spyOn(verifyTokenStub, 'verifyResetPasswordToken').mockReturnValueOnce(Promise.reject(new Error('')))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError())
  })
  test('should return 200 on succeeds', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(ok({ ok: true, message: 'token is valid.' }))
  })
})

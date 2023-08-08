import { VerifyResetPasswordToken } from '../../../../domain/usecases/email/verify-reset-password-token'
import { MissingParamError } from '../../../errors/missing-params-error'
import { badRequest } from '../../../helpers/http/http'
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
})

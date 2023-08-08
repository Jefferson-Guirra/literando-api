import { HttpRequest } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'
import { VerifyResetPasswordTokenController } from './verify-reset-password-token-controller'

const makeFakeRequest = (): HttpRequest => ({
  body: {
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

interface SutTypes {
  validatorStub: Validation
  sut: VerifyResetPasswordTokenController
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const sut = new VerifyResetPasswordTokenController(validatorStub)
  return {
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
})

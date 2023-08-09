import { HttpRequest } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'
import { ResetPasswordController } from './reset-password-controller'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    accessToken: 'any_token',
    password: 'any_password',
    passwordConfirmation: '  any_password'
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
  sut: ResetPasswordController
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const sut = new ResetPasswordController(validatorStub)
  return {
    validatorStub,
    sut
  }
}

describe('ResetPasswordController', () => {
  test('should call validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validatorSpy = jest.spyOn(validatorStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validatorSpy).toHaveBeenCalledWith(makeFakeRequest())
  })
})

import { HttpRequest } from '../../protocols/http'
import { Validation } from '../../protocols/validate'
import { ResetPasswordEmailController } from './reset-password-email-controller'
const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      email: 'any_email@mail.com'
    }
  }
}
const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validation (input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}
interface SutTypes {
  validatorStub: Validation
  sut: ResetPasswordEmailController
}
const makeSut = (): SutTypes => {
  const validatorStub = makeValidationStub()
  const sut = new ResetPasswordEmailController(validatorStub)
  return {
    validatorStub,
    sut
  }
}

describe('ResetPasswordEmailController', () => {
  test('should call validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validatorSpy = jest.spyOn(validatorStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validatorSpy).toHaveBeenCalledWith(makeFakeRequest())
  })
})

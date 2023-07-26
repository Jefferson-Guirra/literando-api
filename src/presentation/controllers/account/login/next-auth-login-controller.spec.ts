import { HttpRequest } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'
import { NexAuthLoginController } from './next-auth-login-controller'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    username: 'any_username',
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

interface SutTypes {
  validatorStub: Validation
  sut: NexAuthLoginController
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const sut = new NexAuthLoginController(validatorStub)
  return {
    validatorStub,
    sut
  }
}

describe('NextAuthLoginController', () => {
  test('should call validation with correct value', async () => {
    const { sut, validatorStub } = makeSut()
    const validationSpy = jest.spyOn(validatorStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validationSpy).toHaveBeenCalledWith(makeFakeRequest())
  })
})

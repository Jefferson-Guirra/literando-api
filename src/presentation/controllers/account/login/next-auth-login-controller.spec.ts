import { HttpRequest } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'
import { NextAuthLoginController } from './next-auth-login-controller'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    routeName: 'any_name',
    privateKey: 'any_key',
    email: 'any_email@mail.com'
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
  sut: NextAuthLoginController
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const sut = new NextAuthLoginController(validatorStub)
  return {
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
})

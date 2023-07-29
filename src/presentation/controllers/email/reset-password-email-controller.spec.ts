import { ResetPasswordEmail } from '../../../domain/usecases/email/reset-pasword-email'
import { MissingParamError } from '../../errors/missing-params-error'
import { badRequest } from '../../helpers/http/http'
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

const makeResetPasswordEmailStub = (): ResetPasswordEmail => {
  class ResetPasswordEmailStub implements ResetPasswordEmail {
    async reset (email: string): Promise<{ email: string, success: boolean }> {
      return await Promise.resolve({ email: 'any_email@mail.com', success: true })
    }
  }
  return new ResetPasswordEmailStub()
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
  resetPasswordEmailStub: ResetPasswordEmail
  validatorStub: Validation
  sut: ResetPasswordEmailController
}
const makeSut = (): SutTypes => {
  const resetPasswordEmailStub = makeResetPasswordEmailStub()
  const validatorStub = makeValidationStub()
  const sut = new ResetPasswordEmailController(validatorStub, resetPasswordEmailStub)
  return {
    resetPasswordEmailStub,
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
  test('should return 400 if validator return error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validation').mockReturnValueOnce(new MissingParamError('any_field'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('should call resetPasswordEmail with correct email', async () => {
    const { sut, resetPasswordEmailStub } = makeSut()
    const resetSpy = jest.spyOn(resetPasswordEmailStub, 'reset')
    await sut.handle(makeFakeRequest())
    expect(resetSpy).toBeCalledWith('any_email@mail.com')
  })
})

import { ResetPasswordEmail, ResetPasswordEmailModel } from '../../../../domain/usecases/email/reset-pasword-email'
import { MissingParamError } from '../../../errors/missing-params-error'
import { badRequest, ok, serverError, unauthorized } from '../../../helpers/http/http'
import { HttpRequest } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'
import { SendResetPasswordRequestController } from './send-reset-password-request-controller'

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      email: 'any_email@mail.com'
    }
  }
}

const makeResetPasswordEmailStub = (): ResetPasswordEmail => {
  class ResetPasswordEmailStub implements ResetPasswordEmail {
    async reset (email: string): Promise< ResetPasswordEmailModel | null > {
      return await Promise.resolve({ email: 'any_email@mail.com', id: 'any_id', accessToken: 'any_token' })
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
  sut: SendResetPasswordRequestController
}
const makeSut = (): SutTypes => {
  const resetPasswordEmailStub = makeResetPasswordEmailStub()
  const validatorStub = makeValidationStub()
  const sut = new SendResetPasswordRequestController(validatorStub, resetPasswordEmailStub)
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

  test('should return 500 if resetPasswordEmail fails', async () => {
    const { sut, resetPasswordEmailStub } = makeSut()
    jest.spyOn(resetPasswordEmailStub, 'reset').mockReturnValueOnce(Promise.reject(new Error('')))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError())
  })

  test('should return 401 if resetPasswordEmail return null', async () => {
    const { sut, resetPasswordEmailStub } = makeSut()
    jest.spyOn(resetPasswordEmailStub, 'reset').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
  })

  test('should return 200 on succeeds', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(ok({ email: 'any_email@mail.com', id: 'any_id', accessToken: 'any_token' }))
  })
})

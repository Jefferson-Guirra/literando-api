import { ResetPasswordAccount, ResetPasswordModel } from '../../../../domain/usecases/account/reset-password-account'
import { MissingParamError } from '../../../errors/missing-params-error'
import { badRequest, unauthorized } from '../../../helpers/http/http'
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

const makeResetPasswordStub = (): ResetPasswordAccount => {
  class ResetPasswordAccountStub implements ResetPasswordAccount {
    async resetPassword (accessToken: string, password: string): Promise<ResetPasswordModel | null> {
      return await Promise.resolve({
        password: 'hashed_new_password'
      })
    }
  }
  return new ResetPasswordAccountStub()
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
  resetPasswordStub: ResetPasswordAccount
  validatorStub: Validation
  sut: ResetPasswordController
}

const makeSut = (): SutTypes => {
  const resetPasswordStub = makeResetPasswordStub()
  const validatorStub = makeValidatorStub()
  const sut = new ResetPasswordController(validatorStub, resetPasswordStub)
  return {
    resetPasswordStub,
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
  test('should return 400 if validator return a error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validation').mockReturnValueOnce(new MissingParamError('any_field'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })
  test('should call resetPassword with correct values', async () => {
    const { sut, resetPasswordStub } = makeSut()
    const resetSpy = jest.spyOn(resetPasswordStub, 'resetPassword')
    await sut.handle(makeFakeRequest())
    expect(resetSpy).toHaveBeenCalledWith('any_token', 'any_password')
  })
  test('should return 401 if  resetPassword return null', async () => {
    const { sut, resetPasswordStub } = makeSut()
    jest.spyOn(resetPasswordStub, 'resetPassword').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
  })
})

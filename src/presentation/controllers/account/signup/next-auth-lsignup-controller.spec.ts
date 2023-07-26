import { NextAuthAccount } from '../../../../domain/models/account/next-auth-account'
import { AddNextAuthAccount } from '../../../../domain/usecases/account/add-next-auth-account'
import { MissingParamError } from '../../../errors/missing-params-error'
import { badRequest, serverError, unauthorized } from '../../../helpers/http/http'
import { HttpRequest } from '../../../protocols/http'
import { Validation } from '../../../protocols/validate'
import { NexAuthSignupController } from './next-auth-signup-controller'

const makeFakeAddAccount = (): NextAuthAccount => ({
  username: 'any_username',
  email: 'any_email@mail.com',
  accessToken: 'any_token'
})

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

const makeAddAccountStub = (): AddNextAuthAccount => {
  class AddNextAuthAccountStub implements AddNextAuthAccount {
    async add (accountModel: NextAuthAccount): Promise<NextAuthAccount | null> {
      return await Promise.resolve(makeFakeAddAccount())
    }
  }
  return new AddNextAuthAccountStub()
}

interface SutTypes {
  validatorStub: Validation
  addAccountStub: AddNextAuthAccount
  sut: NexAuthSignupController
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const addAccountStub = makeAddAccountStub()
  const sut = new NexAuthSignupController(validatorStub, addAccountStub)
  return {
    validatorStub,
    addAccountStub,
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

  test('should return 400 if validator return a error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validation').mockReturnValueOnce(new MissingParamError('any_field'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })
  test('should call addAccount with correct values', async () => {
    const { addAccountStub, sut } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith(makeFakeAddAccount())
  })
  test('should return 401 if addAccount return null', async () => {
    const { addAccountStub, sut } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
  })
  test('should return 500 if addAccount fails', async () => {
    const { addAccountStub, sut } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.reject(new Error('')))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError())
  })
})

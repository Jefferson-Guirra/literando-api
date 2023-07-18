import { SignupController } from './signup-controller'
import { Validation } from '../../../protocols/validate'
import { HttpRequest } from '../../../protocols/http'
import { MissingParamError } from '../../../errors/missing-params-error'
import {
  badRequest,
  serverError,
  unauthorized
  , ok
} from '../../../helpers/http/http'
import { AccountModel } from '../../../../domain/models/account/account'
import { AddAccount, AddAccountModel } from '../../../../domain/usecases/account/add-account'
interface SutTypes {
  sut: SignupController
  validationStub: Validation
  addAccountStub: AddAccount
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    username: 'any_username',
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  username: 'any_username',
  password: 'any_password',
  email: 'any_email@mail.com',
  id: 'any_id'
})

const makeFakeAddAccount = (): AddAccountModel => ({
  username: 'any_username',
  password: 'any_password',
  email: 'any_email@mail.com'
})

const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new AddAccountStub()
}
const makeValidate = (): Validation => {
  class ValidationStub implements Validation {
    validation (input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}
const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccountStub()
  const validationStub = makeValidate()
  const sut = new SignupController(validationStub, addAccountStub)
  return {
    validationStub,
    addAccountStub,
    sut
  }
}
describe('Signup Controller', () => {
  test('Should validation call with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest
      .spyOn(validationStub, 'validation')
      .mockReturnValueOnce(new MissingParamError('any_field'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('should call addAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith(makeFakeAddAccount())
  })

  test('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest
      .spyOn(addAccountStub, 'add')
      .mockImplementation(async () => await Promise.reject(new Error()))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError())
  })

  test('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(ok(makeFakeAccount()))
  })

  test('should return 403 if account exists', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null))
    const account = await sut.handle(makeFakeRequest())
    expect(account).toEqual(unauthorized())
  })
})

export {}

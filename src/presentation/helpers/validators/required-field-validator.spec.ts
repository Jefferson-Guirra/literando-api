import { MissingParamError } from '../../errors/missing-params-error'
import { HttpRequest } from '../../protocols/http'
import { RequiredFieldValidator } from './required-field-validator'

const makeFakeRequest = (fieldName?: string): HttpRequest => {
  const body: any = {
    username: 'any_username',
    password: 'any_password',
    email: 'any_email@mail.com'
  }

  if (fieldName) {
    body[fieldName] = 'any_field'
  }

  return {
    body
  }
}

interface SutTypes {
  sut: RequiredFieldValidator
}

const makeSut = (): SutTypes => {
  const sut = new RequiredFieldValidator('field')
  return {
    sut
  }
}

describe('RequiredFieldValidator', () => {
  test('should return MissingParamsError if validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validation(makeFakeRequest())
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('should return undefined if validation success', () => {
    const { sut } = makeSut()
    const error = sut.validation(makeFakeRequest('field'))
    expect(error).toBeFalsy()
  })
})

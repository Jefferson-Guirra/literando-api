import { MissingParamError } from '../../errors/missing-params-error'
import { HttpRequest } from '../../protocols/http'
import { Validation } from '../../protocols/validate'
import { ValidatorComposite } from './validator-composite'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    field: 'any_field'
  }
})

const makeValidatorStub = (): Validation => {
  class RequiredFieldsValidatorStub implements Validation {
    constructor (private readonly field: string) {}
    validation (input: any): Error | undefined {
      if (!input.body[this.field]) {
        return new MissingParamError(this.field)
      }
    }
  }
  return new RequiredFieldsValidatorStub('field')
}

interface SutTypes {
  validatorsStub: Validation[]
  sut: ValidatorComposite
}

const makeSut = (): SutTypes => {
  const validatorsStub = [makeValidatorStub(), makeValidatorStub()]
  const sut = new ValidatorComposite(validatorsStub)

  return {
    validatorsStub,
    sut
  }
}

describe('ValidatorComposite', () => {
  test('should call validators with correct values', () => {
    const { sut, validatorsStub } = makeSut()
    const validatorSpy = jest.spyOn(validatorsStub[0], 'validation')
    const secondValidatorSpy = jest.spyOn(validatorsStub[1], 'validation')
    sut.validation(makeFakeRequest())
    expect(validatorSpy).toHaveBeenCalledWith(makeFakeRequest())
    expect(secondValidatorSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('should return the first error if more the one validation fails', () => {
    const { sut, validatorsStub } = makeSut()
    jest
      .spyOn(validatorsStub[0], 'validation')
      .mockReturnValueOnce(new MissingParamError('field'))
    jest
      .spyOn(validatorsStub[1], 'validation')
      .mockReturnValueOnce(new Error(''))
    const error = sut.validation(makeFakeRequest())
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('should not return validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validation(makeFakeRequest())
    expect(error).toBeFalsy()
  })
})

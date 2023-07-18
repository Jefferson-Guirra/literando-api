import { InvalidParamsError } from '../../errors/invalid-params-error'
import { HttpRequest } from '../../protocols/http'
import { CompareFieldsValidator } from './compare-fields-validator'

const makeFakeRequest = (changeValue?: string): HttpRequest => {
  const body = {
    field: '123',
    fieldToCompare: '123'
  }
  if (changeValue) body.fieldToCompare = changeValue

  return { body }
}

const makeSut = (): CompareFieldsValidator => new CompareFieldsValidator('field', 'fieldToCompare')

describe('compareFieldsValidator', () => {
  test('should  return invalidParamsError if Validation fails', () => {
    const sut = makeSut()
    const error = sut.validation(makeFakeRequest('12345'))
    expect(error).toEqual(new InvalidParamsError('fieldToCompare'))
  })

  test('should not return if Validation success', () => {
    const sut = makeSut()
    const error = sut.validation(makeFakeRequest())
    expect(error).toBeFalsy()
  })
})

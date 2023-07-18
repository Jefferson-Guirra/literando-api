import { makeGetBookValidator } from './get-book-list-validator-factory'
import { Validation } from '../../../../presentation/protocols/validate'
import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'

jest.mock('../../../../presentation/helpers/validators/validator-composite')

describe('get Book Validator', () => {
  test('should call ValidatorComposite with correct validators', () => {
    makeGetBookValidator()
    const validators: Validation[] = []
    for (const field of ['bookId', 'accessToken']) {
      validators.push(new RequiredFieldValidator(field))
    }
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})

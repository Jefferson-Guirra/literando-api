import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'
import { Validation } from '../../../../presentation/protocols/validate'
import { makeRemoveBookValidator } from './remove-book-validator-factory'

jest.mock('../../../../presentation/helpers/validators/validator-composite')

describe('remove book validator', () => {
  test('should call ValidatorComposite with correct validators', () => {
    makeRemoveBookValidator()
    const validators: Validation[] = []
    for (const field of ['accessToken', 'idBook']) {
      validators.push(new RequiredFieldValidator(field))
    }
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})

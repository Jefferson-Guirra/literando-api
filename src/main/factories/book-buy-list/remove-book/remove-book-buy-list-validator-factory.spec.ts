import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'
import { Validation } from '../../../../presentation/protocols/validate'
import { makeRemoveBookBuyListValidator } from './remove-book-buy-list-validator-factory'

jest.mock('../../../../presentation/helpers/validators/validator-composite')

describe('removeBookBuyListValidator', () => {
  test('should call ValidatorComposite with correct validators', () => {
    makeRemoveBookBuyListValidator()
    const validators: Validation[] = []
    for (const field of ['accessToken', 'bookId']) {
      validators.push(new RequiredFieldValidator(field))
    }
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})

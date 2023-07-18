import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'
import { Validation } from '../../../../presentation/protocols/validate'
import { makeGetBookBuyListValidator } from './get-book-buy-list-validator-factory'

jest.mock('../../../../presentation/helpers/validators/validator-composite')

describe('getBookBuyListValidator', () => {
  test('should call ValidatorComposite with correct validators', () => {
    makeGetBookBuyListValidator()
    const validators: Validation[] = []
    for (const field of ['accessToken', 'bookId']) {
      validators.push(new RequiredFieldValidator(field))
    }
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})

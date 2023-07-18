import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'
import { Validation } from '../../../../presentation/protocols/validate'
import { makeUpdateAmountBookBuyListValidator } from './update-amount-book-buy-list-validator-factory'

jest.mock('../../../../presentation/helpers/validators/validator-composite')

describe('updateAmountBookBuyListValidator', () => {
  test('should call ValidatorComposite with correct values', () => {
    makeUpdateAmountBookBuyListValidator()
    const validators: Validation[] = []
    for (const field of ['accessToken', 'amount', 'bookId']) {
      validators.push(new RequiredFieldValidator(field))
    }
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})

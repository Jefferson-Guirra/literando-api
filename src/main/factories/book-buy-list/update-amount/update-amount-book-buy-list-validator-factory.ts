import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'
import { Validation } from '../../../../presentation/protocols/validate'

export const makeUpdateAmountBookBuyListValidator = (): Validation => {
  const validators: Validation[] = []
  for (const field of ['accessToken', 'amount', 'bookId']) {
    validators.push(new RequiredFieldValidator(field))
  }
  return new ValidatorComposite(validators)
}

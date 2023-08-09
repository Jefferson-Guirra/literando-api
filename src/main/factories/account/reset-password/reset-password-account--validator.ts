import { CompareFieldsValidator } from '../../../../presentation/helpers/validators/compare-fields-validator'
import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'
import { Validation } from '../../../../presentation/protocols/validate'

export const makeResetPasswordAccountValidator = (): Validation => {
  const validators: Validation[] = []
  for (const field of ['accessToken', 'password', 'passwordConfirmation']) {
    validators.push(new RequiredFieldValidator(field))
  }
  validators.push(new CompareFieldsValidator('password', 'passwordConfirmation'))
  return new ValidatorComposite(validators)
}

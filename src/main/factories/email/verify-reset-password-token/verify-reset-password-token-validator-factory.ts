import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'
import { Validation } from '../../../../presentation/protocols/validate'

export const makeVerifyResetPasswordRequestValidator = (): Validation => {
  const validators: Validation[] = []
  validators.push(new RequiredFieldValidator('accessToken'))
  return new ValidatorComposite(validators)
}

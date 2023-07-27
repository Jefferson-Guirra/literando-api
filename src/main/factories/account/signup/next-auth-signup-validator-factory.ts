import { EmailValidation } from '../../../../presentation/helpers/validators/email-validator'
import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'
import { Validation } from '../../../../presentation/protocols/validate'
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter'

export const makeNextAuthSignUpValidator = (): Validation => {
  const validators: Validation[] = []
  for (const validator of ['username', 'email', 'accessToken']) {
    validators.push(new RequiredFieldValidator(validator))
  }
  validators.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidatorComposite(validators)
}

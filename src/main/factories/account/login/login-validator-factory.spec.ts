import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator'
import { EmailValidator } from '../../../../presentation/protocols/email-validator'
import { Validation } from '../../../../presentation/protocols/validate'
import { EmailValidation } from '../../../../presentation/helpers/validators/email-validator'
import { makeLoginValidator } from './login-validator-factory'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'

jest.mock('../../../../presentation/helpers/validators/validator-composite')
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Login Validator factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeLoginValidator()
    const validators: Validation[] = []
    for (const field of ['email', 'password']) {
      validators.push(new RequiredFieldValidator(field))
    }
    validators.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})

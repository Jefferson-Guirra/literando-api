import { CompareFieldsValidator } from '../../../../presentation/helpers/validators/compare-fields-validator'
import { EmailValidation } from '../../../../presentation/helpers/validators/email-validator'
import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'
import { EmailValidator } from '../../../../presentation/protocols/email-validator'
import { Validation } from '../../../../presentation/protocols/validate'
import { makeSignupValidator } from './signup-validator-factory'

jest.mock('../../../../presentation/helpers/validators/validator-composite')

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('signup validator factory', () => {
  test('should call validatorComposite with correct validators', () => {
    makeSignupValidator()
    const validators: Validation[] = []
    for (const field of [
      'username',
      'email',
      'password',
      'passwordConfirmation'
    ]) {
      validators.push(new RequiredFieldValidator(field))
    }
    validators.push(
      new CompareFieldsValidator('password', 'passwordConfirmation')
    )
    validators.push(new EmailValidation('email', makeEmailValidatorStub()))
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})

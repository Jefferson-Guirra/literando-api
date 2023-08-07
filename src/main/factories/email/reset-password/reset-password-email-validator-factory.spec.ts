import { EmailValidation } from '../../../../presentation/helpers/validators/email-validator'
import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'
import { EmailValidator } from '../../../../presentation/protocols/email-validator'
import { Validation } from '../../../../presentation/protocols/validate'
import { makeResetPasswordEmailValidator } from './reset-password-email-validator-factory'

jest.mock('../../../../presentation/helpers/validators/validator-composite')

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('makeResetPasswordEmailValidator', () => {
  test('should call validatorComposite with correct validators', () => {
    makeResetPasswordEmailValidator()
    const validators: Validation[] = []
    validators.push(new RequiredFieldValidator('email'))
    validators.push(new EmailValidation('email', makeEmailValidatorStub()))
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})

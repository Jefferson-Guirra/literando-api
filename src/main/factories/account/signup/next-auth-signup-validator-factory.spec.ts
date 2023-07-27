import { EmailValidator } from '../../../../presentation/protocols/email-validator'
import { Validation } from '../../../../presentation/protocols/validate'
import { makeNextAuthSignUpValidator } from './next-auth-signup-validator-factory'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'
import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator'
import { EmailValidation } from '../../../../presentation/helpers/validators/email-validator'

jest.mock('../../../../presentation/helpers/validators/validator-composite')

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('makeNextAuthSignUpValidator', () => {
  test('should call ValidatorComposite with correct validators', () => {
    makeNextAuthSignUpValidator()
    const validators: Validation[] = []
    for (const field of ['username', 'email', 'accessToken']) {
      validators.push(new RequiredFieldValidator(field))
    }
    validators.push(new EmailValidation('email', makeEmailValidatorStub()))
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})

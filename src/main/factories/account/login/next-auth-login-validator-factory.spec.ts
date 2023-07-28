import { EmailValidation } from '../../../../presentation/helpers/validators/email-validator'
import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'
import { EmailValidator } from '../../../../presentation/protocols/email-validator'
import { Validation } from '../../../../presentation/protocols/validate'
import { makeNextAuthLoginValidator } from './next-auth-login-validator-factory'

jest.mock('../../../../presentation/helpers/validators/validator-composite')

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorAdapterStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorAdapterStub()
}

describe('makeNextAuthLoginValidator', () => {
  test('should call ValidatorComposite with correct values', () => {
    makeNextAuthLoginValidator()
    const validators: Validation[] = []
    for (const field of ['routeName', 'privateKey', 'email', 'accessToken']) {
      validators.push(new RequiredFieldValidator(field))
    }
    validators.push(new EmailValidation('email', makeEmailValidatorStub()))
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})

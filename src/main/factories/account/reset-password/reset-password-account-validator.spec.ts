import { CompareFieldsValidator } from '../../../../presentation/helpers/validators/compare-fields-validator'
import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'
import { Validation } from '../../../../presentation/protocols/validate'
import { makeResetPasswordAccountValidator } from './reset-password-account--validator'

jest.mock('../../../../presentation/helpers/validators/validator-composite')

describe('makeResetPasswordAccountValidator', () => {
  test('should call ValidatorComposite with correct validators', () => {
    const validators: Validation[] = []
    makeResetPasswordAccountValidator()
    for (const field of ['accessToken', 'password', 'passwordConfirmation']) {
      validators.push(new RequiredFieldValidator(field))
    }
    validators.push(new CompareFieldsValidator('password', 'passwordConfirmation'))
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})

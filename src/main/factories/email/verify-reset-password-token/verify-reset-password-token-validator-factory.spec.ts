import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'
import { Validation } from '../../../../presentation/protocols/validate'
import { makeVerifyResetPasswordRequestValidator } from './verify-reset-password-token-validator-factory'

jest.mock('../../../../presentation/helpers/validators/validator-composite')

describe('makeVerifyResetPasswordRequestValidator', () => {
  test('should call ValidatorComposite with correct validators', () => {
    makeVerifyResetPasswordRequestValidator()
    const validators: Validation[] = []
    validators.push(new RequiredFieldValidator('accessToken'))
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})

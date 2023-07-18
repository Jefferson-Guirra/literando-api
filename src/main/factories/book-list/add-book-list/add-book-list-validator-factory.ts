import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'
import { Validation } from '../../../../presentation/protocols/validate'

const requiredFields = [
  'title',
  'description',
  'authors',
  'price',
  'language',
  'publisher',
  'publisherDate',
  'imgUrl',
  'accessToken',
  'bookId',
  'pageCount'
]

export const makeAddBookValidator = (): Validation => {
  const validators: Validation[] = []
  for (const field of requiredFields) {
    validators.push(new RequiredFieldValidator(field))
  }
  return new ValidatorComposite(validators)
}

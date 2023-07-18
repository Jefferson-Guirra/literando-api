import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'
import { Validation } from '../../../../presentation/protocols/validate'

const requiredFields = [
  'accessToken',
  'bookId',
  'authors',
  'description',
  'title',
  'imgUrl',
  'language',
  'price',
  'publisher',
  'publisherDate',
  'pageCount'
]

export const makeAddBookBuyListValidator = (): Validation => {
  const validators: Validation[] = []
  for (const field of requiredFields) {
    validators.push(new RequiredFieldValidator(field))
  }
  return new ValidatorComposite(validators)
}

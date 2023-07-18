import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'
import { Validation } from '../../../../presentation/protocols/validate'
import { makeAddBookValidator } from './add-book-list-validator-factory'

jest.mock('../../../../presentation/helpers/validators/validator-composite')

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

describe('add Book list validator', () => {
  test('should call ValidatorComposit whit correct validators', () => {
    makeAddBookValidator()
    const validators: Validation[] = []
    for (const field of requiredFields) {
      validators.push(new RequiredFieldValidator(field))
    }
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})

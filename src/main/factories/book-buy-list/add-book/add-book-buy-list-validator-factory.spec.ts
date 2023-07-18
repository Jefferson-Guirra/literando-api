import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'
import { Validation } from '../../../../presentation/protocols/validate'
import { makeAddBookBuyListValidator } from './add-book-buy-list-validator-factory'

jest.mock('../../../../presentation/helpers/validators/validator-composite')
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
describe('add book buy list validator', () => {
  test('should call ValidatorComposite with correct validators', () => {
    makeAddBookBuyListValidator()
    const validators: Validation[] = []
    for (const field of requiredFields) {
      validators.push(new RequiredFieldValidator(field))
    }
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})

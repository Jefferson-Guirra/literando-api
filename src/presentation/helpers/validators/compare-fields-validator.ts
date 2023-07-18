import { InvalidParamsError } from '../../errors/invalid-params-error'
import { Validation } from '../../protocols/validate'

export class CompareFieldsValidator implements Validation {
  constructor (
    private readonly field: string,
    private readonly compareField: string
  ) {}

  validation (input: any): Error | undefined {
    if (input.body[this.field] !== input.body[this.compareField]) {
      return new InvalidParamsError(this.compareField)
    }
  }
}

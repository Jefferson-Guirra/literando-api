import { Validation } from '../../protocols/validate'

export class ValidatorComposite implements Validation {
  constructor (private readonly validators: Validation[]) {}
  validation (input: any): Error | undefined {
    for (const validator of this.validators) {
      const error = validator.validation(input)
      if (error !== undefined) {
        return error
      }
    }
  }
}

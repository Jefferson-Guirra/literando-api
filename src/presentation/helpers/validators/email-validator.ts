import { InvalidParamsError } from '../../errors/invalid-params-error'
import { EmailValidator } from '../../protocols/email-validator'
import { Validation } from '../../protocols/validate'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validation (input: any): Error | undefined {
    const isValid = this.emailValidator.isValid(input.body[this.fieldName])
    if (!isValid) {
      return new InvalidParamsError(this.fieldName)
    }
  }
}

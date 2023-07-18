export interface Validation {
  validation: (input: any) => Error | undefined
}

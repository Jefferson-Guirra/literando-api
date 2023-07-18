export class InvalidParamsError extends Error {
  constructor (paramName: string) {
    super(`invalid param: ${paramName}`)
    this.name = 'Invalid Params Error'
  }
}

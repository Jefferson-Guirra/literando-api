export class ServerError extends Error {
  constructor (stack?: string) {
    super('internal server Error')
    this.name = 'Server error'
    this.stack = stack
  }
}

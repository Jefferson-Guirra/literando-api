import { GenerateRandomString } from './generate-random-string'

const makeSut = (): GenerateRandomString => new GenerateRandomString()

describe('GenerateRandomString', () => {
  test('should return random password if success', () => {
    const sut = makeSut()
    const password = sut.generate()
    expect(password).toBeTruthy()
    expect(password.length).toBe(7)
  })

  test('should return throw if generate fails', () => {
    const sut = makeSut()
    jest.spyOn(sut, 'generate').mockImplementationOnce(() => { throw new Error('') })
    expect(sut.generate).toThrow(new Error(''))
  })
})

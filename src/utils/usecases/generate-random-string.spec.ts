import { GenerateRandomString } from './generate-random-string'

const makeSut = (): GenerateRandomString => new GenerateRandomString()

describe('GenerateRandomString', () => {
  test('should return random password if success', () => {
    const sut = makeSut()
    const password = sut.generate()
    expect(password).toBeTruthy()
    expect(password.length).toBe(7)
  })
})

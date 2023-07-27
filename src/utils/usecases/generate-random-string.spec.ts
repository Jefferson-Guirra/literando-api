import { GenerateRandomString } from './generate-random-string'
import generator from 'generate-password'

const makeSut = (): GenerateRandomString => new GenerateRandomString()

describe('GenerateRandomString', () => {
  test('should call generator with correct value', () => {
    const sut = makeSut()
    const generatorSpy = jest.spyOn(generator, 'generate')
    sut.generate()
    expect(generatorSpy).toHaveBeenCalledWith({
      exclude: '',
      excludeSimilarCharacters: false,
      strict: false,
      lowercase: true,
      length: 7,
      numbers: true,
      symbols: true,
      uppercase: true
    })
  })

  test('should return random password if success', () => {
    const sut = makeSut()
    jest.spyOn(generator, 'generate').mockReturnValueOnce('1234567')
    const password = sut.generate()
    expect(password).toBeTruthy()
    expect(password).toBe('1234567')
    expect(password.length).toBe(7)
  })

  test('should return throw if generate fails', () => {
    const sut = makeSut()
    jest.spyOn(sut, 'generate').mockImplementationOnce(() => { throw new Error('') })
    expect(sut.generate).toThrow(new Error(''))
  })
})

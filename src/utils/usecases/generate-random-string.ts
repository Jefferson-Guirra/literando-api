import { GenerateRandomPassword } from '../protocols/generate-random-password'

export class GenerateRandomString implements GenerateRandomPassword {
  generate (): string {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const passwordLength = 7
    let password = ''

    for (let i = 0; i < passwordLength; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length)
      password += chars.substring(randomNumber, randomNumber + 1)
    }
    return password
  }
}

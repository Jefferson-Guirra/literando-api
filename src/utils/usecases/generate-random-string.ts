import { GenerateRandomPassword } from '../protocols/generate-random-password'
import generator from 'generate-password'

export class GenerateRandomString implements GenerateRandomPassword {
  generate (): string {
    const password = generator.generate({
      exclude: '',
      excludeSimilarCharacters: false,
      strict: false,
      lowercase: true,
      length: 7,
      numbers: true,
      symbols: false,
      uppercase: true
    })

    return password
  }
}

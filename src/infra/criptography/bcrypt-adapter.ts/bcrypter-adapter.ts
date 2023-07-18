import bcrypt from 'bcrypt'
import { Hasher } from '../../../data/protocols/criptography/hasher'
import { HashCompare } from '../../../data/protocols/criptography/hash-compare'

export class BcrypterAdapter implements Hasher, HashCompare {
  constructor (private readonly salt: number) {}
  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const validate = await bcrypt.compare(value, hash)
    return validate
  }
}

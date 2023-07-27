import { Controller } from '../../../../presentation/protocols/controller'
import { NexAuthSignupController } from '../../../../presentation/controllers/account/signup/next-auth-signup-controller'
import { makeNextAuthSignUpValidator } from './next-auth-signup-validator-factory'
import { DbNextAuthAddAccount } from '../../../../data/usecases/account/add-account/db-add-next-auth-account'
import { AccountMongoRepository } from '../../../../infra/db/account/account-mongo-repository'
import { GenerateRandomString } from '../../../../utils/usecases/generate-random-string'
import { BcrypterAdapter } from '../../../../infra/criptography/bcrypt-adapter.ts/bcrypter-adapter'

const salt = 12
export const makeNextAuthSignupController = (): Controller => {
  const validator = makeNextAuthSignUpValidator()
  const accountMongoRepository = new AccountMongoRepository()
  const generateString = new GenerateRandomString()
  const bcryptAdapter = new BcrypterAdapter(salt)
  const dbaAddNextAuthAccount = new DbNextAuthAddAccount(accountMongoRepository, accountMongoRepository, generateString, bcryptAdapter)
  return new NexAuthSignupController(validator, dbaAddNextAuthAccount)
}

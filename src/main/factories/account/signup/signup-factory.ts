import { DbAddAccountRepository } from '../../../../data/usecases/account/add-account/db-add-account'
import { BcrypterAdapter } from '../../../../infra/criptography/bcrypt-adapter.ts/bcrypter-adapter'
import { AccountMongoRepository } from '../../../../infra/db/account/account-mongo-repository'
import { LogMongoRepository } from '../../../../infra/db/log/log-mongo-repository'
import { SignupController } from '../../../../presentation/controllers/account/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { makeSignupValidator } from './signup-validator-factory'

export const makeSignUpController = (): Controller => {
  const validation = makeSignupValidator()
  const accountMongoRepository = new AccountMongoRepository()
  const bcrypterAdapter = new BcrypterAdapter(12)
  const addAccountRepository = new DbAddAccountRepository(
    accountMongoRepository,
    bcrypterAdapter,
    accountMongoRepository
  )
  const logMongoRepository = new LogMongoRepository()
  const signupController = new SignupController(
    validation,
    addAccountRepository
  )
  return new LogControllerDecorator(signupController, logMongoRepository)
}

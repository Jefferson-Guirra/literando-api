import { DbAuthentication } from '../../../../data/usecases/account/authentication/db-authentication'
import { BcrypterAdapter } from '../../../../infra/criptography/bcrypt-adapter.ts/bcrypter-adapter'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/account/account-mongo-repository'
import { LogMongoRepository } from '../../../../infra/db/log/log-mongo-repository'
import { LoginController } from '../../../../presentation/controllers/account/login/login-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { makeLoginValidator } from './login-validator-factory'

export const makeLoginController = (): Controller => {
  const validate = makeLoginValidator()
  const bcryptAdapter = new BcrypterAdapter(12)
  const jwtAdapter = new JwtAdapter(process.env.JWT_SECRET as string)
  const accountMongoRepository = new AccountMongoRepository()
  const authentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  )
  const logMongoRepository = new LogMongoRepository()
  const loginController = new LoginController(validate, authentication)
  return new LogControllerDecorator(loginController, logMongoRepository)
}

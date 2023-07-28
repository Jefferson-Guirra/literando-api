import { DbNextAuthAuthentication } from '../../../../data/usecases/account/authentication/db-next-auth-authentication'
import { AccountMongoRepository } from '../../../../infra/db/account/account-mongo-repository'
import { PrivateRouteMongoRepository } from '../../../../infra/db/private-route/private-route-mongo-repository'
import { NextAuthLoginController } from '../../../../presentation/controllers/account/login/next-auth-login-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { makeNextAuthLoginValidator } from './next-auth-login-validator-factory'

export const makeNextAuthLoginController = (): Controller => {
  const validator = makeNextAuthLoginValidator()
  const privateRouteMongoRepository = new PrivateRouteMongoRepository()
  const accountMongoRepository = new AccountMongoRepository()
  const dbNextAuthAuthentication = new DbNextAuthAuthentication(privateRouteMongoRepository, accountMongoRepository, accountMongoRepository)
  return new NextAuthLoginController(validator, dbNextAuthAuthentication)
}

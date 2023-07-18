import { DbLogoutAccount } from '../../../../data/usecases/account/logout-account/logout-account'
import { AccountMongoRepository } from '../../../../infra/db/account/account-mongo-repository'
import { LogoutController } from '../../../../presentation/controllers/account/logout/logout-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator'
export const makeLogoutController = (): Controller => {
  const logoutValidate = new RequiredFieldValidator('accessToken')
  const accountMongoRepository = new AccountMongoRepository()
  const dbLogoutAccount = new DbLogoutAccount(
    accountMongoRepository,
    accountMongoRepository
  )
  return new LogoutController(logoutValidate, dbLogoutAccount)
}

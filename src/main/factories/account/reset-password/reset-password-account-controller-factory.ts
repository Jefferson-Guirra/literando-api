import { DbResetPasswordAccount } from '../../../../data/usecases/account/reset-password-account/db-reset-password-account'
import { BcrypterAdapter } from '../../../../infra/criptography/bcrypt-adapter.ts/bcrypter-adapter'
import { AccountMongoRepository } from '../../../../infra/db/account/account-mongo-repository'
import { ResetPasswordAccountRequestRepository } from '../../../../infra/db/email/reset-password-account-request-repository'
import { ResetPasswordController } from '../../../../presentation/controllers/account/reset-password/reset-password-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { makeResetPasswordAccountValidator } from './reset-password-account--validator'

const salt = 12
export const makeResetPasswordAccountController = (): Controller => {
  const validator = makeResetPasswordAccountValidator()
  const bcryptAdapter = new BcrypterAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const requestMongoRepository = new ResetPasswordAccountRequestRepository()
  const dbResetPasswordAccount = new DbResetPasswordAccount(requestMongoRepository, bcryptAdapter, accountMongoRepository, requestMongoRepository)
  return new ResetPasswordController(validator, dbResetPasswordAccount)
}

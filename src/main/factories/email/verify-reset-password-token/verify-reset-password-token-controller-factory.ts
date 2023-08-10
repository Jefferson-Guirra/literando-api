import { DbVerifyResetPasswordToken } from '../../../../data/usecases/requests/verify-reset-password-token/db-verify-reset-password-token'
import { RequestMongoRepository } from '../../../../infra/db/requests/request-mongo-repository'
import { VerifyResetPasswordTokenController } from '../../../../presentation/controllers/requests/verify-reset-password-token/verify-reset-password-token-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { makeVerifyResetPasswordRequestValidator } from './verify-reset-password-token-validator-factory'

export const makeVerifyResetPasswordTokenController = (): Controller => {
  const validator = makeVerifyResetPasswordRequestValidator()
  const resetPasswordAccountRepository = new RequestMongoRepository()
  const dbVerifyResetPasswordToken = new DbVerifyResetPasswordToken(resetPasswordAccountRepository)
  return new VerifyResetPasswordTokenController(validator, dbVerifyResetPasswordToken)
}

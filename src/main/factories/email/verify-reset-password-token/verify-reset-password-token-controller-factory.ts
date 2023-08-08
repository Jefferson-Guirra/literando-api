import { DbVerifyResetPasswordToken } from '../../../../data/usecases/email/verify-reset-password-token/db-verify-reset-password-token'
import { ResetPasswordAccountRepository } from '../../../../infra/db/email/reset-password-account-repository'
import { VerifyResetPasswordTokenController } from '../../../../presentation/controllers/email/verify-reset-password-token/verify-reset-password-token-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { makeVerifyResetPasswordRequestValidator } from './verify-reset-password-token-validator-factory'

export const makeVerifyResetPasswordTokenController = (): Controller => {
  const validator = makeVerifyResetPasswordRequestValidator()
  const resetPasswordAccountRepository = new ResetPasswordAccountRepository()
  const dbVerifyResetPasswordToken = new DbVerifyResetPasswordToken(resetPasswordAccountRepository)
  return new VerifyResetPasswordTokenController(validator, dbVerifyResetPasswordToken)
}

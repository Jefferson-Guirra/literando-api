import { DbResetPasswordEmail } from '../../../../data/usecases/requests/reset-password/db-reset-password-email'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/account/account-mongo-repository'
import { ResetPasswordAccountRequestRepository } from '../../../../infra/db/email/reset-password-account-request-repository'
import { NodemailerAdapter } from '../../../../infra/email/nodemailer-adapter/nodemailer-adapter'
import { ResetPasswordEmailController } from '../../../../presentation/controllers/email/reset-pasword/reset-password-email-controller'
import { makeResetPasswordEmailValidator } from './reset-password-email-validator-factory'
import env from '../../../config/env'
import { Controller } from '../../../../presentation/protocols/controller'
import { GmailData, NodemailerGmailTransporter } from '../../../../infra/email/nodemailer-adapter/usecases/nodemailer-transporter/nodemailer-gmail-transporter'
import { GetOauthToken } from '../../../../infra/email/nodemailer-adapter/usecases/get-access-token/get-oauth-token'
import { LogMongoRepository } from '../../../../infra/db/log/log-mongo-repository'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'

const gmailData: GmailData = {
  serviceEmail: env.serviceEmail,
  clientId: env.googleClientId as string,
  clientSecret: env.googleSecret as string,
  refreshToken: env.googleRefreshToken as string
}

export const makeResetPasswordEmailController = (): Controller => {
  const validator = makeResetPasswordEmailValidator()
  const accountMongoRepository = new AccountMongoRepository()
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const getOAuthToken = new GetOauthToken()
  const transporter = new NodemailerGmailTransporter(gmailData, getOAuthToken)
  const resetPasswordAccountRepository = new ResetPasswordAccountRequestRepository()
  const nodemailerAdapter = new NodemailerAdapter(env.serviceEmail, env.appUrl, transporter)
  const dbResetPasswordEmail = new DbResetPasswordEmail(
    accountMongoRepository,
    nodemailerAdapter,
    jwtAdapter,
    resetPasswordAccountRepository,
    resetPasswordAccountRepository,
    resetPasswordAccountRepository)
  const logMongoRepository = new LogMongoRepository()
  const resetPasswordEmailController = new ResetPasswordEmailController(validator, dbResetPasswordEmail)
  return new LogControllerDecorator(resetPasswordEmailController, logMongoRepository)
}

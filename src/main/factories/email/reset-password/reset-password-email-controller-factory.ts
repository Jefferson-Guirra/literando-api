import { DbResetPasswordRequest } from '../../../../data/usecases/requests/reset-password/db-reset-password-request'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/account/account-mongo-repository'
import { RequestMongoRepository } from '../../../../infra/db/requests/request-mongo-repository'
import { NodemailerAdapter } from '../../../../infra/email/nodemailer-adapter/nodemailer-adapter'
import { SendResetPasswordRequestController } from '../../../../presentation/controllers/requests/reset-pasword/send-reset-password-request-controller'
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
  const resetPasswordAccountRepository = new RequestMongoRepository()
  const nodemailerAdapter = new NodemailerAdapter(env.serviceEmail, env.appUrl, transporter)
  const dbResetPasswordEmail = new DbResetPasswordRequest(
    accountMongoRepository,
    nodemailerAdapter,
    jwtAdapter,
    resetPasswordAccountRepository,
    resetPasswordAccountRepository,
    resetPasswordAccountRepository)
  const logMongoRepository = new LogMongoRepository()
  const resetPasswordEmailController = new SendResetPasswordRequestController(validator, dbResetPasswordEmail)
  return new LogControllerDecorator(resetPasswordEmailController, logMongoRepository)
}

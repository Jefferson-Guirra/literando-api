import { Router } from 'express'
import { makeResetPasswordEmailController } from '../factories/email/reset-password/reset-password-email-controller-factory'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeVerifyResetPasswordTokenController } from '../factories/email/verify-reset-password-token/verify-reset-password-token-controller-factory'

const requestRoutes = (router: Router): void => {
  router.post('/reset-password-request', adaptRoute(makeResetPasswordEmailController()))
  router.post('/verify-request', adaptRoute(makeVerifyResetPasswordTokenController()))
}

export default requestRoutes

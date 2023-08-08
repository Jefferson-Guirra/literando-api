import { Router } from 'express'
import { makeResetPasswordEmailController } from '../factories/email/reset-password/reset-password-email-controller-factory'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeVerifyResetPasswordTokenController } from '../factories/email/verify-reset-password-token/verify-reset-password-token-controller-factory'

const resetPasswordRoutes = (router: Router): void => {
  router.post('/send-reset-password-email-message', adaptRoute(makeResetPasswordEmailController()))
  router.post('/verify-reset-password-token', adaptRoute(makeVerifyResetPasswordTokenController()))
}

export default resetPasswordRoutes

import { Router } from 'express'
import { makeResetPasswordEmailController } from '../factories/email/reset-password/reset-password-email-controller-factory'
import { adaptRoute } from '../adapters/express/express-route-adapter'

const sendEmailRoutes = (router: Router): void => {
  router.post('/send-reset-password-email-message', adaptRoute(makeResetPasswordEmailController()))
}

export default sendEmailRoutes

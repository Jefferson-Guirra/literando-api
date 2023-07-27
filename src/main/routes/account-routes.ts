import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeSignUpController } from '../factories/account/signup/signup-factory'
import { makeLoginController } from '../factories/account/login/login-controller'
import { makeLogoutController } from '../factories/account/logout/logout-controller'
import { makeNextAuthSignupController } from '../factories/account/signup/next-auth-signup-factory'

const accountRouter = (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/next-auth-signup', adaptRoute(makeNextAuthSignupController()))
  router.post('/login', adaptRoute(makeLoginController()))
  router.post('/logout', adaptRoute(makeLogoutController()))
}
export default accountRouter

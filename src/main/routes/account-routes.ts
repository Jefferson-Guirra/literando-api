import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeSignUpController } from '../factories/account/signup/signup-factory'
import { makeLoginController } from '../factories/account/login/login-controller'
import { makeLogoutController } from '../factories/account/logout/logout-controller'
import { makeNextAuthSignupController } from '../factories/account/signup/next-auth-signup-factory'
import { makeNextAuthLoginController } from '../factories/account/login/next-auth-login-controller'

const accountRouter = (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/next-auth-signup', adaptRoute(makeNextAuthSignupController()))
  router.put('/login', adaptRoute(makeLoginController()))
  router.put('/next-auth-login', adaptRoute(makeNextAuthLoginController()))
  router.put('/logout', adaptRoute(makeLogoutController()))
}
export default accountRouter

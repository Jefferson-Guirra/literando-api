import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeSignUpController } from '../factories/account/signup/signup-factory'
import { makeLoginController } from '../factories/account/login/login-controller'

const accountRouter = (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
export default accountRouter

import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeSignUpController } from '../factories/account/signup/signup-factory'

const accountRouter = (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
}
export default accountRouter

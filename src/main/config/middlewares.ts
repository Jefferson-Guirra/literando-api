import { bodyParser } from '../middlewares/body-parser'
import { Express } from 'express'
import { cors } from '../middlewares/cors'
import { contentType } from '../middlewares/content-type'

export const setupMiddlewares = (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
}

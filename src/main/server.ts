import env from '../main/config/env'
import { MongoHelper } from '../infra/db/helpers/mongo-helper'
import app from './config/app'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    app.listen(env.port, () => {
      console.log('running in http://localhost:8080')
    })
  }).catch(console.error)

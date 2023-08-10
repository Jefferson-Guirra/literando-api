import env from '../main/config/env'
import { MongoHelper } from '../infra/db/helpers/mongo-helper'
import app from './config/app'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    app.listen(Number(env.port), '0.0.0.0', () => {
      console.log('running in ' + env.serverUrl)
    })
  }).catch(console.error)

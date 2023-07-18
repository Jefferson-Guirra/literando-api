import env from '../main/config/env'
import { MongoHelper } from '../infra/db/helpers/mongo-helper'
import express from 'express'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = express()
    app.listen(env.port, () => {
      console.log('running in http://localhost:8080')
    })
  }).catch(console.error)

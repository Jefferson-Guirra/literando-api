import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/helpers/mongo-helper'
import app from '../config/app'

let accountsCollection: Collection
describe('POST /send-reset-password-message', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  test('should  return 200 on succeeds', async () => {
    await accountsCollection.insertOne({
      username: 'any_username',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    await request(app).post('/api/send-reset-password-email-message').send({ email: 'any_email@mail.com' }).expect(200)
  })
})

import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/helpers/mongo-helper'
import app from '../config/app'

let accountsCollection: Collection
let requestsCollection: Collection
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
  test('should  return 401 if fails', async () => {
    await request(app).post('/api/send-reset-password-email-message').send({ email: 'any_email@mail.com' }).expect(401)
  })
})

describe('POST /verify-reset-password-token', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  beforeEach(async () => {
    requestsCollection = await MongoHelper.getCollection('resetPasswordAccounts')
    await requestsCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  test('should return 401 if verify fails', async () => {
    await request(app).post('/api/verify-reset-password-token').send({ accessToken: 'any_token' }).expect(401)
  })
  test('should return 200 on succeeds', async () => {
    await requestsCollection.insertOne({ email: 'any_email@mail.com', accessToken: 'any_token' })
    await request(app).post('/api/verify-reset-password-token').send({ accessToken: 'any_token' }).expect(200)
  })
})

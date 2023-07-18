import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/helpers/mongo-helper'
import { Collection } from 'mongodb'

let accountCollection: Collection

describe('Account routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection?.deleteMany({})
  })
  test('should return a account on success', async () => {
    await request(app).post('/api/signup').send({
      username: 'jefferson',
      email: 'jeffersontest_jest@gmail.com',
      password: '123456',
      passwordConfirmation: '123456'
    }).expect(200)
  })
})

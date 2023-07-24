import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection

describe('Post/ Login', () => {
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

describe('POST /login', () => {
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

  test('should return 200 on login', async () => {
    const password = await hash('123', 12)
    await accountCollection.insertOne({
      username: 'Jefferson',
      email: 'jeffersonloop14@mail.com',
      password
    })
    await request(app)
      .post('/api/login')
      .send({
        email: 'jeffersonloop14@mail.com',
        password: '123'
      }).expect(200)
  })

  test('should return 401 on login', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'jeffersonloop14@gmail.com',
        password: '123'
      }).expect(401)
  })
})

describe('POST /logout', () => {
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

  test('should return 200 if logout success', async () => {
    const result = await accountCollection.insertOne({
      username: 'any_username',
      email: 'any_email@mail.com',
      password: 'any_password',
      accessToken: 'any_token'
    })
    await request(app).post('/api/logout').send({ accessToken: 'any_token' }).expect(200)
    const account = await accountCollection.findOne({ _id: result.insertedId })
    expect(account?.accessToken).toBeFalsy()
  })
})

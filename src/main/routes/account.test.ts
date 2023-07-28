import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/helpers/mongo-helper'
import { Collection, ObjectId } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection
let privateRoutesCollection: Collection
const insertAccountDatabase = async (): Promise<ObjectId> => {
  const result = await accountCollection.insertOne({
    username: 'any_username',
    email: 'any_email@mail.com',
    password: 'any_password',
    accessToken: 'any_token'

  })
  return result.insertedId
}

const insertPrivateRoute = async (): Promise<void> => {
  await privateRoutesCollection.insertOne({
    routeName: 'any_name',
    privateKey: 'any_key'
  })
}

describe('POST /signup', () => {
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

  test('should return 401 if add account fails', async () => {
    await insertAccountDatabase()
    await request(app).post('/api/signup').send({
      username: 'any_username',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }).expect(401)
  })
})

describe('POST /next-auth-signup', () => {
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

  test('should return 200 on success', async () => {
    await request(app).post('/api/next-auth-signup').send({
      username: 'any_username',
      email: 'any_email@mail.com',
      accessToken: 'any_token'
    }).expect(200)
    const promise = await request(app).post('/api/next-auth-signup').send({
      username: 'jefferson',
      email: 'jeffersontest_jest@gmail.com',
      accessToken: 'any_token'
    })
    const response = promise.body
    expect(response).toBeTruthy()
    expect(response.body.username).toBe('jefferson')
    expect(response.body.email).toBe('jeffersontest_jest@gmail.com')
    expect(response.body.accessToken).toBeTruthy()
    expect(response.body.password).toBeTruthy()
    expect(response.body.accessToken).toBeTruthy()
    expect(response.body.id).toBeTruthy()
  })

  test('should return 401 if add account fails', async () => {
    await insertAccountDatabase()
    await request(app).post('/api/next-auth-signup').send({
      username: 'any_username',
      email: 'any_email@mail.com',
      accessToken: 'any_token'
    }).expect(401)
  })
})

describe('PUT /login', () => {
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
      .put('/api/login')
      .send({
        email: 'jeffersonloop14@mail.com',
        password: '123'
      }).expect(200)
  })

  test('should return 401 on login', async () => {
    await request(app)
      .put('/api/login')
      .send({
        email: 'jeffersonloop14@gmail.com',
        password: '123'
      }).expect(401)
  })
})

describe('Put /next-auth-login', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    privateRoutesCollection = await MongoHelper.getCollection('privateRoutes')
    await accountCollection?.deleteMany({})
    await privateRoutesCollection.deleteMany({})
  })
  test('should return 200 on succeeds', async () => {
    await insertAccountDatabase()
    await insertPrivateRoute()
    await request(app).put(('/api/next-auth-login')).send({
      routeName: 'any_name',
      privateKey: 'any_key',
      email: 'any_email@mail.com',
      accessToken: 'any_token'
    }).expect(200)
  })
  test('should return 401 if login fails', async () => {
    await request(app).put('/api/next-auth-login').send({
      routeName: 'any_name',
      privateKey: 'any_key',
      email: 'any_email@mail.com',
      accessToken: 'any_token'
    }).expect(401)
  })
})

describe('Put /logout', () => {
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
    const accountId = await insertAccountDatabase()
    await request(app).put('/api/logout').send({ accessToken: 'any_token' }).expect(200)
    const account = await accountCollection.findOne({ _id: accountId })
    expect(account?.accessToken).toBeFalsy()
  })
  test('should return 401 if logout fails', async () => {
    await request(app).put('/api/logout').send({ accessToken: 'any_token' }).expect(401)
  })
})

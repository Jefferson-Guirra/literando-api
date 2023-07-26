import { Collection } from 'mongodb'
import { MongoHelper } from '../../infra/db/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'

let accountsCollection: Collection
let buyBooksCollection: Collection

const insertAccountDatabase = async (): Promise<string> => {
  const result = await accountsCollection.insertOne({
    username: 'any_username',
    email: 'any_email@mail.com',
    password: 'any_password',
    accessToken: 'any_token'
  })
  return result.insertedId.toString()
}

const insertBookDatabase = async (userId: string): Promise<void> => {
  await buyBooksCollection.insertOne({
    userId,
    title: 'any_title',
    description: 'any_description',
    authors: "['any_author']",
    language: 'any_language',
    price: 0.0,
    publisher: 'any_publisher',
    publisherDate: 'any_date',
    imgUrl: 'any_url',
    accessToken: 'any_token',
    queryDoc: userId + 'any_id',
    pageCount: 1,
    bookId: 'any_id'
  })
}

describe('POST /add-buy-book', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    buyBooksCollection = await MongoHelper.getCollection('buyBooksList')
    await accountsCollection.deleteMany({})
    await buyBooksCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return 200 if add book success', async () => {
    await insertAccountDatabase()
    await request(app).post('/api/add-buy-book').send({
      title: 'any_title',
      description: 'any_description',
      authors: "['any_author']",
      language: 'any_language',
      price: 0.0,
      publisher: 'any_publisher',
      publisherDate: 'any_date',
      imgUrl: 'any_url',
      accessToken: 'any_token',
      pageCount: 1,
      bookId: 'any_id'
    }).expect(200)
  })

  test('should 401 if add book fails', async () => {
    await request(app).post('/api/add-buy-book').send({
      title: 'any_title',
      description: 'any_description',
      authors: "['any_author']",
      language: 'any_language',
      price: 0.0,
      publisher: 'any_publisher',
      publisherDate: 'any_date',
      imgUrl: 'any_url',
      accessToken: 'any_token',
      pageCount: 1,
      bookId: 'any_id'
    }).expect(401)
  })
})

describe('GET /get-buy-book', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    buyBooksCollection = await MongoHelper.getCollection('buyBooksList')
    await accountsCollection.deleteMany({})
    await buyBooksCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return 200 if get book success', async () => {
    const accountId = await insertAccountDatabase()
    await insertBookDatabase(accountId)
    await request(app).post('/api/get-buy-book').send({ accessToken: 'any_token', bookId: 'any_id' }).expect(200)
    const promise = await request(app).post('/api/get-buy-book').send({ accessToken: 'any_token', bookId: 'any_id' })
    const response = await promise.body
    expect(response.body).toBeTruthy()
  })

  test('should return 401 if get book fails', async () => {
    await request(app).post('/api/get-buy-book').send({ accessToken: 'any_token', bookId: 'any_id' }).expect(401)
  })
})

describe('DELETE /remove-buy-book', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    buyBooksCollection = await MongoHelper.getCollection('buyBooksList')
    await accountsCollection.deleteMany({})
    await buyBooksCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return 200 if remove book success', async () => {
    const accountId = await insertAccountDatabase()
    await insertBookDatabase(accountId)
    await request(app).delete('/api/remove-buy-book').send({ accessToken: 'any_token', bookId: 'any_id' }).expect(200)
    await insertBookDatabase(accountId)
    const promise = await request(app).delete('/api/remove-buy-book').send({ accessToken: 'any_token', bookId: 'any_id' })
    const response = await promise.body
    expect(response.body).toBeTruthy()
  })
})
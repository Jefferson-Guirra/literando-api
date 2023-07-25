import { Collection } from 'mongodb'
import { MongoHelper } from '../../infra/db/helpers/mongo-helper'
import app from '../config/app'
import request from 'supertest'

let booksCollection: Collection
let accountsCollection: Collection
describe('Post /add-book', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  beforeEach(async () => {
    booksCollection = await MongoHelper.getCollection('bookList')
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
    await booksCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  test('should return 200 if success', async () => {
    await accountsCollection.insertOne({
      username: 'any_username',
      email: 'any_email@mail.com',
      password: 'any_password',
      accessToken: 'any_token'
    })
    await request(app).post('/api/add-book').send({
      title: 'any_title',
      description: 'any_description',
      authors: "['any_author']",
      price: 0.0,
      language: 'any_language',
      publisher: 'any_publisher',
      publisherDate: 'any_date',
      imgUrl: 'any_url',
      pageCount: 1,
      accessToken: 'any_token',
      bookId: 'any_id'
    }).expect(200)
  })

  test('should return 400 if invalid credentials provided', async () => {
    await accountsCollection.insertOne({
      username: 'any_username',
      email: 'any_email@mail.com',
      password: 'any_password',
      accessToken: 'any_token'
    })
    await request(app).post('/api/add-book').send({
      description: 'any_description',
      authors: "['any_author']",
      price: 0.0,
      language: 'any_language',
      publisher: 'any_publisher',
      publisherDate: 'any_date',
      imgUrl: 'any_url',
      pageCount: 1,
      accessToken: 'any_token',
      bookId: 'any_id'
    }).expect(400)
  })
  test('should return 401 if invalid accessToken', async () => {
    await request(app).post('/api/add-book').send({
      title: 'any_title',
      description: 'any_description',
      authors: "['any_author']",
      price: 0.0,
      language: 'any_language',
      publisher: 'any_publisher',
      publisherDate: 'any_date',
      imgUrl: 'any_url',
      pageCount: 1,
      accessToken: 'any_token',
      bookId: 'any_id'
    }).expect(401)
  })
})

describe('Post /get-book', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  beforeEach(async () => {
    booksCollection = await MongoHelper.getCollection('bookList')
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
    await booksCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return 200 if success', async () => {
    const result = await accountsCollection.insertOne({
      username: 'any_username',
      email: 'any_email@mail.com',
      password: 'any_password',
      accessToken: 'any_token'
    })

    await booksCollection.insertOne({
      title: 'any_title',
      description: 'any_description',
      authors: "['any_author']",
      price: 0.0,
      language: 'any_language',
      publisher: 'any_publisher',
      publisherDate: 'any_date',
      imgUrl: 'any_url',
      queryDoc: result.insertedId.toString() + 'any_id',
      pageCount: 1,
      bookId: 'any_id'
    })

    await request(app).post('/api/get-book').send({ accessToken: 'any_token', bookId: 'any_id' }).expect(200)
    const promise = await request(app).post('/api/get-book').send({ accessToken: 'any_token', bookId: 'any_id' })
    const response = await promise.body

    expect(response).toBeTruthy()
  })
  test('should return 401 if credentials invalid provided', async () => {
    await request(app).post('/api/get-book').send({ accessToken: 'any_token', bookId: 'any_id' }).expect(401)
  })
})

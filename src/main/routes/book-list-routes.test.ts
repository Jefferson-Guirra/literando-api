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
})

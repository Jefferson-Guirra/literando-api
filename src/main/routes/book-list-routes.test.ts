import { Collection } from 'mongodb'
import { MongoHelper } from '../../infra/db/helpers/mongo-helper'
import app from '../config/app'
import request from 'supertest'

let booksCollection: Collection
let accountsCollection: Collection

const insertAccountStub = async (): Promise<string> => {
  const result = await accountsCollection.insertOne({
    username: 'any_username',
    email: 'any_email@mail.com',
    password: 'any_password',
    accessToken: 'any_token'
  })
  return result.insertedId.toString()
}

const InsertBookStub = async (userId: string): Promise<void> => {
  await booksCollection.insertOne({
    userId,
    title: 'any_title',
    description: 'any_description',
    authors: "['any_author']",
    price: 0.0,
    language: 'any_language',
    publisher: 'any_publisher',
    publisherDate: 'any_date',
    imgUrl: 'any_url',
    queryDoc: userId + 'any_id',
    pageCount: 1,
    bookId: 'any_id'
  })
}

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
    await insertAccountStub()
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

  test('should return 401 if add fails', async () => {
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
    const accountId = await insertAccountStub()
    await InsertBookStub(accountId)

    await request(app).post('/api/get-book').send({ accessToken: 'any_token', bookId: 'any_id' }).expect(200)
    const promise = await request(app).post('/api/get-book').send({ accessToken: 'any_token', bookId: 'any_id' })
    const response = await promise.body

    expect(response).toBeTruthy()
  })
  test('should return 401 if credentials invalid provided', async () => {
    await request(app).post('/api/get-book').send({ accessToken: 'any_token', bookId: 'any_id' }).expect(401)
  })
})

describe('Delete /remove-book', () => {
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
    const accountId = await insertAccountStub()
    await InsertBookStub(accountId)
    let count = await booksCollection.countDocuments()
    expect(count).toBe(1)
    await request(app).delete('/api/remove-book').send({ accessToken: 'any_token', idBook: 'any_id' }).expect(200)
    count = await booksCollection.countDocuments()
    expect(count).toBe(0)
  })

  test('should return 401 if remove fails', async () => {
    await request(app).delete('/api/remove-book').send({ accessToken: 'any_token', idBook: 'any_id' }).expect(401)
  })
})

describe('Get /get-books', () => {
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

  test('should return 200 if getBooks success', async () => {
    const accountId = await insertAccountStub()
    await InsertBookStub(accountId)
    await request(app).post('/api/get-books').send({ accessToken: 'any_token' }).expect(200)
    const promise = await request(app).post('/api/get-books').send({ accessToken: 'any_token' }).expect(200)
    const response = await promise.body
    expect(response.body.length).toEqual(1)
  })

  test('should return 401 iff getBooks fails', async () => {
    await request(app).post('/api/get-books').send({ accessToken: 'any_token' }).expect(401)
  })
})

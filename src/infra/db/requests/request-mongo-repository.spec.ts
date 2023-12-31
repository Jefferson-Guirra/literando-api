import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { RequestMongoRepository } from './request-mongo-repository'

let requestsCollection: Collection
const makeSut = (): RequestMongoRepository => new RequestMongoRepository()

describe('RequestMongoRepository', () => {
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
  test('should return account data if add success', async () => {
    const sut = makeSut()
    let count = await requestsCollection.countDocuments()
    expect(count).toBe(0)
    const response = await sut.add('any_email@mail.com', 'any_token')
    count = await requestsCollection.countDocuments()
    expect(count).toBe(1)
    expect(response).toBeTruthy()
    expect(response?.id).toBeTruthy()
    expect(response?.email).toBe('any_email@mail.com')
    expect(response?.accessToken).toBe('any_token')
  })
  test('should return account data if GetResetPasswordRequestRepository success', async () => {
    const sut = makeSut()
    await requestsCollection.insertOne({ email: 'any_email@mail.com', accessToken: 'any_token' })
    const response = await sut.loadRequestByEmail('any_email@mail.com')
    expect(response).toBeTruthy()
    expect(response?.id).toBeTruthy()
    expect(response?.email).toBe('any_email@mail.com')
    expect(response?.accessToken).toBe('any_token')
  })
  test('should return nul if GetResetPasswordRequestRepository return null', async () => {
    const sut = makeSut()
    const response = await sut.loadRequestByEmail('any_email@mail.com')
    expect(response).toBeFalsy()
  })
  test('should return account data if UpdateResetPasswordTokenRepository success', async () => {
    const sut = makeSut()
    await requestsCollection.insertOne({ email: 'any_email@mail.com', accessToken: 'any_token' })
    const response = await sut.update('any_email@mail.com', 'random_token')
    expect(response).toBeTruthy()
    expect(response?.id).toBeTruthy()
    expect(response?.email).toBe('any_email@mail.com')
    expect(response?.accessToken).toBe('random_token')
  })
  test('should return null if UpdateResetPasswordTokenRepository return null', async () => {
    const sut = makeSut()
    const response = await sut.update('any_email@mail.com', 'random_token')
    expect(response).toBeFalsy()
  })
  test('should return null if loadRequestByAccessToken return nul', async () => {
    const sut = makeSut()
    const response = await sut.loadRequestByAccessToken('any_token')
    expect(response).toBeFalsy()
  })
  test('should return account data on succeeds', async () => {
    const sut = makeSut()
    await requestsCollection.insertOne({ email: 'any_email@mail.com', accessToken: 'any_token' })
    const response = await sut.loadRequestByAccessToken('any_token')
    expect(response).toBeTruthy()
    expect(response?.id).toBeTruthy()
    expect(response?.email).toBe('any_email@mail.com')
    expect(response?.accessToken).toBe('any_token')
  })
  test('should remove request  if removeRequest success', async () => {
    const sut = makeSut()
    await requestsCollection.insertOne({
      email: 'any_email@mail.com',
      accessToken: 'any_token'
    })
    let count = await requestsCollection.countDocuments()
    expect(count).toBe(1)
    await sut.removeRequest('any_token')
    count = await requestsCollection.countDocuments()
    expect(count).toBe(0)
  })
})

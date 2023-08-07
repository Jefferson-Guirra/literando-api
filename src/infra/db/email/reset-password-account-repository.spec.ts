import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { ResetPasswordAccountRepository } from './reset-password-account-repository'

let resetPasswordAccountsCollection: Collection
const makeSut = (): ResetPasswordAccountRepository => new ResetPasswordAccountRepository()

describe('ResetPasswordAccountRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  beforeEach(async () => {
    resetPasswordAccountsCollection = await MongoHelper.getCollection('resetPasswordAccounts')
    await resetPasswordAccountsCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  test('should return account data if add success', async () => {
    const sut = makeSut()
    let count = await resetPasswordAccountsCollection.countDocuments()
    expect(count).toBe(0)
    const response = await sut.add('any_email@mail.com', 'any_token')
    count = await resetPasswordAccountsCollection.countDocuments()
    expect(count).toBe(1)
    expect(response).toBeTruthy()
    expect(response?.id).toBeTruthy()
    expect(response?.email).toBe('any_email@mail.com')
    expect(response?.accessToken).toBe('any_token')
  })
  test('should return account data if GetResetPasswordRequestRepository success', async () => {
    const sut = makeSut()
    await resetPasswordAccountsCollection.insertOne({ email: 'any_email@mail.com', accessToken: 'any_token' })
    const response = await sut.find('any_email@mail.com')
    expect(response).toBeTruthy()
    expect(response?.id).toBeTruthy()
    expect(response?.email).toBe('any_email@mail.com')
    expect(response?.accessToken).toBe('any_token')
  })
  test('should return nul if GetResetPasswordRequestRepository return null', async () => {
    const sut = makeSut()
    const response = await sut.find('any_email@mail.com')
    expect(response).toBeFalsy()
  })
  test('should return account data if UpdateResetPasswordTokenRepository success', async () => {
    const sut = makeSut()
    await resetPasswordAccountsCollection.insertOne({ email: 'any_email@mail.com', accessToken: 'any_token' })
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
})

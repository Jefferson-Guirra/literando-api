import { Collection, Document, InsertOneResult } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

const makeSut = (): AccountMongoRepository => new AccountMongoRepository()
const addAccountDatabase = async (): Promise<InsertOneResult<Document>> => {
  return await accountCollection.insertOne({
    username: 'any_username',
    email: 'any_email@mail.com',
    password: 'any_password',
    accessToken: 'any_token'
  })
}
let accountCollection: Collection
describe('AccountMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return account loadByEmail success', async () => {
    const sut = makeSut()
    await addAccountDatabase()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.email).toBe('any_email@mail.com')
    expect(account?.password).toBe('any_password')
    expect(account?.username).toBe('any_username')
  })

  test('should return null if loadByEmail fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email')
    expect(account).toBeFalsy()
  })

  test('should return account if add success', async () => {
    const sut = makeSut()
    const account = await sut.add({
      username: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.username).toBe('any_name')
    expect(account.password).toBe('any_password')
    expect(account.email).toBe('any_email@mail.com')
  })

  test('should return account if addNextAuthAccount success', async () => {
    const sut = makeSut()
    const account = await sut.addNextAuthAccount({
      username: 'any_username',
      email: 'any_email@mail.com',
      password: 'any_password',
      accessToken: 'any_token'
    })
    expect(account).toBeTruthy()
    expect(account?.username).toBe('any_username')
    expect(account?.email).toBe('any_email@mail.com')
    expect(account?.password).toBe('any_password')
    expect(account?.accessToken).toBe('any_token')
  })

  test('should update the account accessToken on updateAccessToken success', async () => {
    const sut = makeSut()
    const result = await addAccountDatabase()
    let account = await accountCollection.findOne({ _id: result.insertedId })
    expect(account?.accessToken).toEqual('any_token')
    await sut.update(result.insertedId.toString(), 'random_token')
    account = await accountCollection.findOne({ _id: result.insertedId })
    expect(account?.accessToken).toBe('random_token')
  })

  test('should return account if loadByAccessToken success', async () => {
    const sut = makeSut()
    const result = await addAccountDatabase()
    const account = await accountCollection.findOne({ _id: result.insertedId })
    const loadByAccessTokenAccount = await sut.loadByAccessToken(
      account?.accessToken
    )
    expect(loadByAccessTokenAccount).toBeTruthy()
    expect(loadByAccessTokenAccount?.username).toBe('any_username')
    expect(loadByAccessTokenAccount?.password).toBe('any_password')
    expect(loadByAccessTokenAccount?.email).toBe('any_email@mail.com')
    expect(loadByAccessTokenAccount?.accessToken).toBe('any_token')
  })

  test('should return null if loadByAccessToken return null', async () => {
    const sut = makeSut()
    const account = await sut.loadByAccessToken('any_token')
    expect(account).toBeFalsy()
  })

  test('should remove accessToken if remove success', async () => {
    const sut = makeSut()
    const result = await addAccountDatabase()
    let account = await accountCollection.findOne({ accessToken: 'any_token' })
    expect(account).toBeTruthy()
    expect(account?.accessToken).toBeTruthy()
    await sut.remove(account?.accessToken)
    account = await accountCollection.findOne({ _id: result.insertedId })
    expect(account).toBeTruthy()
    expect(account?.username).toBe('any_username')
    expect(account?.password).toBe('any_password')
    expect(account?.email).toBe('any_email@mail.com')
    expect(account?.accessToken).toBeFalsy()
  })
  test('should update  password if resetPassword success', async () => {
    const sut = makeSut()
    const result = await addAccountDatabase()
    const account = await sut.resetPassword('any_email@mail.com', 'random_password')
    const newAccount = await accountCollection.findOne({ _id: result.insertedId })
    expect(newAccount?.password).toEqual('random_password')
    expect(account?.id).toBeTruthy()
    expect(account?.username).toEqual('any_username')
    expect(account?.email).toEqual('any_email@mail.com')
    expect(account?.password).toEqual('random_password')
    expect(account?.accessToken).toEqual('any_token')
  })
})

export {}

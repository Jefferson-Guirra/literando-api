import { Collection } from 'mongodb'
import { PrivateRouteMongoRepository } from './private-route-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'

let privateRoutesCollection: Collection
const insertPrivateRoute = async (): Promise<void> => {
  await privateRoutesCollection.insertOne({
    routeName: 'any_name',
    privateKey: 'any_key'
  })
}
const makeSut = (): PrivateRouteMongoRepository => new PrivateRouteMongoRepository()
describe('PrivateRouteMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  beforeEach(async () => {
    privateRoutesCollection = await MongoHelper.getCollection('privateRoutes')
    await privateRoutesCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  test('should return privateRoute on succeeds', async () => {
    const sut = makeSut()
    await insertPrivateRoute()
    const response = await sut.loadByRouteName('any_name')
    expect(response).toEqual({ routeName: 'any_name', privateKey: 'any_key' })
  })
  test('should return null if LoadPrivateRoute return null', async () => {
    const sut = makeSut()
    const response = await sut.loadByRouteName('any_name')
    expect(response).toBeFalsy()
  })
})

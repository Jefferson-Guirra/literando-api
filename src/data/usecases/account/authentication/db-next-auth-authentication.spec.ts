import { nextAuthAuthenticationModel } from '../../../../domain/usecases/account/next-auth-authentication'
import { LoadPrivateRouteByNameRepository, PrivateRouteModel } from '../../../protocols/db/private-route/load-private-route-by-name-repository'
import { DbNextAuthAuthentication } from './db-next-auth-authentication'

const makeFakeRequest = (): nextAuthAuthenticationModel => ({
  routeName: 'any_name',
  privateKey: 'any_key',
  email: 'any_email',
  accessToken: 'any_token'
})
const makeLoadPrivateRouteStub = (): LoadPrivateRouteByNameRepository => {
  class LoadPrivateRouteByNameRepositoryStub implements LoadPrivateRouteByNameRepository {
    async loadByRouteName (routeName: string): Promise<PrivateRouteModel | null> {
      return await Promise.resolve({ routeName: 'any_name', privateKey: '' })
    }
  }
  return new LoadPrivateRouteByNameRepositoryStub()
}
interface SutTypes {
  sut: DbNextAuthAuthentication
  loadPrivateRouteStub: LoadPrivateRouteByNameRepository
}

const makeSut = (): SutTypes => {
  const loadPrivateRouteStub = makeLoadPrivateRouteStub()
  const sut = new DbNextAuthAuthentication(loadPrivateRouteStub)
  return {
    loadPrivateRouteStub,
    sut
  }
}

describe('DbNextAuthAuthentication', () => {
  test('should call loadPrivateRoute with correct values', async () => {
    const { sut, loadPrivateRouteStub } = makeSut()
    const loadSpy = jest.spyOn(loadPrivateRouteStub, 'loadByRouteName')
    await sut.auth(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_name')
  })
  test('should return undefined if loadPrivateRoute return null', async () => {
    const { sut, loadPrivateRouteStub } = makeSut()
    jest.spyOn(loadPrivateRouteStub, 'loadByRouteName').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.auth(makeFakeRequest())
    expect(response).toEqual(undefined)
  })
})

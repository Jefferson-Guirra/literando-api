import { NextAuth, NextAuthAuthentication, nextAuthAuthenticationModel } from '../../../../domain/usecases/account/next-auth-authentication'
import { LoadPrivateRouteByNameRepository } from '../../../protocols/db/private-route/load-private-route-by-name-repository'

export class DbNextAuthAuthentication implements NextAuthAuthentication {
  constructor (private readonly loadPrivateRoute: LoadPrivateRouteByNameRepository) {}
  async auth (data: nextAuthAuthenticationModel): Promise<NextAuth | null | undefined> {
    const { routeName } = data
    await this.loadPrivateRoute.loadByRouteName(routeName)
    return null
  }
}

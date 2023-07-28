import { NextAuth, NextAuthAuthentication, nextAuthAuthenticationModel } from '../../../../domain/usecases/account/next-auth-authentication'
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository'
import { LoadPrivateRouteByNameRepository } from '../../../protocols/db/private-route/load-private-route-by-name-repository'

export class DbNextAuthAuthentication implements NextAuthAuthentication {
  constructor (
    private readonly loadPrivateRoute: LoadPrivateRouteByNameRepository,
    private readonly loadAccount: LoadAccountByEmailRepository
  ) {}

  async auth (data: nextAuthAuthenticationModel): Promise<NextAuth | null | undefined> {
    const { routeName, privateKey, email } = data
    const route = await this.loadPrivateRoute.loadByRouteName(routeName)
    if (!route || privateKey !== route.privateKey) {
      return undefined
    }
    await this.loadAccount.loadByEmail(email)
    return {
      accessToken: 'any_token',
      username: 'any_username'
    }
  }
}

import { NextAuth, NextAuthAuthentication, nextAuthAuthenticationModel } from '../../../../domain/usecases/account/next-auth-authentication'
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../../protocols/db/account/update-acess-token-repository'
import { LoadPrivateRouteByNameRepository } from '../../../protocols/db/private-route/load-private-route-by-name-repository'

export class DbNextAuthAuthentication implements NextAuthAuthentication {
  constructor (
    private readonly loadPrivateRoute: LoadPrivateRouteByNameRepository,
    private readonly loadAccount: LoadAccountByEmailRepository,
    private readonly updateAccessToken: UpdateAccessTokenRepository
  ) {}

  async auth (data: nextAuthAuthenticationModel): Promise<NextAuth | null | undefined> {
    const { routeName, privateKey, email, accessToken } = data
    const route = await this.loadPrivateRoute.loadByRouteName(routeName)
    if (!route || privateKey !== route.privateKey) {
      return undefined
    }
    const account = await this.loadAccount.loadByEmail(email)
    if (!account) {
      return undefined
    }
    await this.updateAccessToken.update(account.id, accessToken)
    return {
      accessToken,
      username: account.username
    }
  }
}

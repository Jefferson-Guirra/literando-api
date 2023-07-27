export interface nextAuthAuthenticationModel {
  routeName: string
  privateKey: string
  email: string
  accessToken: string
}

export interface NextAuth {
  accessToken: string
  username: string
}

export interface NextAuthAuthentication {
  auth: (data: nextAuthAuthenticationModel) => Promise<NextAuth | undefined | null >
}

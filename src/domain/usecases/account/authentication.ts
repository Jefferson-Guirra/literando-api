export interface AuthenticationModel {
  email: string
  password: string
}

export interface Auth {
  accessToken: string
  username: string
}

export interface Authentication {
  auth: (account: AuthenticationModel) => Promise<Auth | null>
}

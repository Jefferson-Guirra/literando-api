import { NextAuthAccount } from '../../models/account/next-auth-account'

export interface AddNextAuthAccountModel {
  username: string
  email: string
  accessToken: string
}

export interface AddNextAuthAccount {
  add: (accountModel: AddNextAuthAccountModel) => Promise<NextAuthAccount | null>
}

import { NextAuthAccount } from '../../models/account/next-auth-account'

export interface AddNextAuthAccount {
  add: (accountModel: NextAuthAccount) => Promise<NextAuthAccount | null>
}

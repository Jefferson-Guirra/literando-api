import { NextAuthAccount } from '../../../../domain/models/account/next-auth-account'
import { AddNextAuthAccountModel } from '../../../../domain/usecases/account/add-next-auth-account'

export interface AddNextAuthAccountRepository {
  addNextAuthAccount: (account: AddNextAuthAccountModel) => Promise<NextAuthAccount | null >
}

import { NextAuthAccount } from '../../../../domain/models/account/next-auth-account'
import { AddNextAuthAccountModel } from '../../../../domain/usecases/account/add-next-auth-account'

export interface AddNextAuthAccountRepositoryModel extends AddNextAuthAccountModel {
  password: string
}
export interface AddNextAuthAccountRepository {
  addNextAuthAccount: (account: AddNextAuthAccountRepositoryModel) => Promise<NextAuthAccount | null >
}

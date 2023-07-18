import { AccountModel } from '../../models/account/account'

export interface AddAccountModel {
  username: string
  email: string
  password: string
}
export interface AddAccount {
  add: (account: AddAccountModel) => Promise<AccountModel | null>
}

import { LoadAccountByEmailRepository } from '../../../data/protocols/db/account/load-account-by-email-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountModel } from '../../../domain/models/account/account'
import { AddAccountRepository } from '../../../data/protocols/db/account/add-account-repository'
import { AddAccountModel } from '../../../domain/usecases/account/add-account'
import { ObjectId } from 'mongodb'
import { UpdateAccessTokenRepository } from '../../../data/protocols/db/account/update-acess-token-repository'
import {
  LoadAccountByAccessTokenRepository,
  accountLoginModel
} from '../../../data/protocols/db/account/load-account-by-access-token-repository'
import { RemoveAccessTokenRepository } from '../../../data/protocols/db/account/remove-access-token-repository'
import { AddNextAuthAccountRepository, AddNextAuthAccountRepositoryModel } from '../../../data/protocols/db/account/add-next-auth-account-repository'
import { NextAuthAccount } from '../../../domain/models/account/next-auth-account'
import { ResetPasswordAccountModel, ResetPasswordAccountRepository } from '../../../data/protocols/db/account/reset-password-account-repository'

export class AccountMongoRepository
implements
    LoadAccountByEmailRepository,
    AddAccountRepository,
    AddNextAuthAccountRepository,
    UpdateAccessTokenRepository,
    LoadAccountByAccessTokenRepository,
    RemoveAccessTokenRepository,
    ResetPasswordAccountRepository {
  async loadByEmail (email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.Map(account)
  }

  async loadByAccessToken (
    accessToken: string
  ): Promise<accountLoginModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      accessToken
    })
    return account && MongoHelper.Map(account)
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(account)
    const newAccount = await accountCollection.findOne({
      _id: new ObjectId(result.insertedId)
    })
    return newAccount && MongoHelper.Map(newAccount)
  }

  async update (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          accessToken: token
        }
      }
    )
  }

  async remove (accessToken: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne(
      { accessToken },
      {
        $unset: {
          accessToken: ''
        }
      }
    )
  }

  async addNextAuthAccount (account: AddNextAuthAccountRepositoryModel): Promise<NextAuthAccount | null> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const result = await accountsCollection.insertOne(account)
    const newAccount = await accountsCollection.findOne({ _id: result.insertedId })
    return newAccount && MongoHelper.Map(newAccount)
  }

  async resetPassword (email: string, password: string): Promise<ResetPasswordAccountModel | null> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const account = await accountsCollection.findOneAndUpdate({ email }, {
      $set: {
        password
      }
    },
    {
      returnDocument: 'after'
    })
    return account.value && MongoHelper.Map(account.value)
  }
}

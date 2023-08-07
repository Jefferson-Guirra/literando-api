import { AddResetPasswordRequestRepository } from '../../../data/protocols/db/email/add-reset-password-request-repository'
import { GetResetPasswordRequestRepository, ResetPasswordRequestModel } from '../../../data/protocols/db/email/get-reset-password-request-repository'
import { UpdateResetPasswordTokenRepository } from '../../../data/protocols/db/email/update-reset-password-token-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class ResetPasswordAccountRepository implements AddResetPasswordRequestRepository,
GetResetPasswordRequestRepository,
UpdateResetPasswordTokenRepository {
  async add (email: string, accessToken: string): Promise<ResetPasswordRequestModel | null> {
    const resetCollection = await MongoHelper.getCollection('resetPasswordAccounts')
    const result = await resetCollection.insertOne({ email, accessToken })
    const doc = await resetCollection.findOne({ _id: result.insertedId })
    return doc && MongoHelper.Map(doc)
  }

  async find (email: string): Promise<ResetPasswordRequestModel | null> {
    const resetCollection = await MongoHelper.getCollection('resetPasswordAccounts')
    const doc = await resetCollection.findOne({ email })
    return doc && MongoHelper.Map(doc)
  }

  async update (email: string, accessToken: string): Promise<ResetPasswordRequestModel | null> {
    const resetCollection = await MongoHelper.getCollection('resetPasswordAccounts')

    const doc = await resetCollection.findOneAndUpdate({ email }, {
      $set: {
        accessToken
      }
    },
    { returnDocument: 'after' })

    return doc.value && MongoHelper.Map(doc.value)
  }
}

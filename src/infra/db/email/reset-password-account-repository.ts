import { AddResetPasswordRequestRepository } from '../../../data/protocols/db/email/add-reset-password-request-repository'
import { ResetPasswordRequestModel } from '../../../data/protocols/db/email/get-reset-password-request-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class ResetPasswordAccountRepository implements AddResetPasswordRequestRepository {
  async add (email: string, accessToken: string): Promise<ResetPasswordRequestModel | null> {
    const resetCollection = await MongoHelper.getCollection('resetPasswordAccounts')
    const result = await resetCollection.insertOne({ email, accessToken })
    const doc = await resetCollection.findOne({ _id: result.insertedId })
    return doc && MongoHelper.Map(doc)
  }
}

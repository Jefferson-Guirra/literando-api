import { AddResetPasswordRequestRepository } from '../../../data/protocols/db/email/add-reset-password-request-repository'
import { LoadResetPasswordRequestByEmailRepository, ResetPasswordRequestModel } from '../../../data/protocols/db/email/load-reset-password-request-by-email-repository'
import { UpdateResetPasswordTokenRepository } from '../../../data/protocols/db/email/update-reset-password-token-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class ResetPasswordAccountRepository implements AddResetPasswordRequestRepository,
LoadResetPasswordRequestByEmailRepository,
UpdateResetPasswordTokenRepository {
  async add (email: string, accessToken: string): Promise<ResetPasswordRequestModel | null> {
    const resetCollection = await MongoHelper.getCollection('resetPasswordAccounts')
    const result = await resetCollection.insertOne({ email, accessToken })
    const doc = await resetCollection.findOne({ _id: result.insertedId })
    return doc && MongoHelper.Map(doc)
  }

  async loadRequestByEmail (email: string): Promise<ResetPasswordRequestModel | null> {
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

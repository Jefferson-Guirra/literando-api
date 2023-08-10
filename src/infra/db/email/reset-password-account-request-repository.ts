import { AddResetPasswordRequestRepository } from '../../../data/protocols/db/requests/add-reset-password-request-repository'
import { RemoveRequestRepository } from '../../../data/protocols/db/requests/remove-request-repository'
import { LoadResetPasswordRequestByAccessTokenRepository } from '../../../data/protocols/db/requests/load-reset-password-request-by-access-token-repository'
import { LoadResetPasswordRequestByEmailRepository, ResetPasswordRequestModel } from '../../../data/protocols/db/requests/load-reset-password-request-by-email-repository'
import { UpdateResetPasswordTokenRepository } from '../../../data/protocols/db/requests/update-reset-password-token-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class ResetPasswordAccountRequestRepository implements AddResetPasswordRequestRepository,
LoadResetPasswordRequestByEmailRepository,
UpdateResetPasswordTokenRepository,
LoadResetPasswordRequestByAccessTokenRepository,
RemoveRequestRepository {
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

  async loadRequestByAccessToken (accessToken: string): Promise<ResetPasswordRequestModel | null> {
    const requestsCollection = await MongoHelper.getCollection('resetPasswordAccounts')
    const request = await requestsCollection.findOne({ accessToken })
    return request && MongoHelper.Map(request)
  }

  async removeRequest (accessToken: string): Promise<void> {
    const requestsCollection = await MongoHelper.getCollection('resetPasswordAccounts')
    await requestsCollection.deleteOne({ accessToken })
  }
}

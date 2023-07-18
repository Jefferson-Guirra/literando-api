import type { NextApiRequest, NextApiResponse } from 'next'
import { Controller } from '../../../presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '../../../presentation/protocols/http'
import { MongoHelper } from '../../../infra/db/helpers/mongo-helper'

export const adapterRouter = (controller: Controller) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    await MongoHelper.connect(process.env.MONGO_URL as string)

    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse: HttpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode === 200) {
      res.status(httpResponse.statusCode).json(httpResponse)
    } else {
      res.status(httpResponse.statusCode).json({
        statusCode: httpResponse.statusCode,
        body: httpResponse.body.message
      })
    }
  }
}

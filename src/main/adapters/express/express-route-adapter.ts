import { Request, Response } from 'express'
import { Controller } from '../../../presentation/protocols/controller'
import { HttpRequest } from '../../../presentation/protocols/http'
export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode === 200) {
      res.status(httpResponse.statusCode).json(httpResponse)
    } else {
      res.status(httpResponse.statusCode).json({
        statusCode: httpResponse.statusCode,
        error: httpResponse.body.message
      })
    }
  }
}

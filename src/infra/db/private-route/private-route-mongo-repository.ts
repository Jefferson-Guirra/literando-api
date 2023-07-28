import { LoadPrivateRouteByNameRepository, PrivateRouteModel } from '../../../data/protocols/db/private-route/load-private-route-by-name-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class PrivateRouteMongoRepository implements LoadPrivateRouteByNameRepository {
  async loadByRouteName (routeName: string): Promise<PrivateRouteModel | null> {
    const privateRoutesCollection = await MongoHelper.getCollection('privateRoutes')
    const privateRoute = await privateRoutesCollection.findOne({ routeName })
    return privateRoute && {
      routeName: privateRoute.routeName,
      privateKey: privateRoute.privateKey
    }
  }
}

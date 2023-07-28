export interface PrivateRouteModel {
  routeName: string
  privateKey: string
}
export interface LoadPrivateRouteByNameRepository {
  loadByRouteName: (routeName: string) => Promise<PrivateRouteModel | null>
}

export interface RemoveRequestRepository {
  removeRequest: (accessToken: string) => Promise<void>
}

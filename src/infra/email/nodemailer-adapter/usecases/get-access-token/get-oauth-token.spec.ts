import { GetOauthToken } from './get-oauth-token'
import env from '../../../../../main/config/env'

describe('GetOauthToken', () => {
  test('should return accessToken on success)', async () => {
    const sut = new GetOauthToken()
    const response = await sut.getToken(env.googleClientId as string, env.googleSecret as string, env.googleRefreshToken as string)
    expect(response).toBeTruthy()
  })
})

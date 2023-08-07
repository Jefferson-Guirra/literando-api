import { GetOauthToken } from './get-oauth-token'
import env from '../../../../../main/config/env'

describe('GetOauthToken', () => {
  test('should return accessToken on success', async () => {
    const sut = new GetOauthToken()
    const response = await sut.getToken(env.googleClientId as string, env.googleSecret as string, env.googleRefreshToken as string)
    expect(response).toBeTruthy()
  })
  test('should return throw if invalid clientId provided', async () => {
    const sut = new GetOauthToken()
    const promise = sut.getToken('any_id', env.googleSecret as string, env.googleRefreshToken as string)
    await expect(promise).rejects.toThrow()
  })

  test('should return throw if invalid secret key provided', async () => {
    const sut = new GetOauthToken()
    const promise = sut.getToken(env.googleClientId as string, 'any_key', env.googleRefreshToken as string)
    await expect(promise).rejects.toThrow()
  })
})

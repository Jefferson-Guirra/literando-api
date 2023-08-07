import { GetOauthAccessToken } from '../../protocols/get-oauth-access-token'
import { google } from 'googleapis'

export class GetOauthToken implements GetOauthAccessToken {
  async getToken (clientId: string, clientSecret: string, refreshToken: string): Promise<{ accessToken: string }> {
    const OAuth2 = google.auth.OAuth2
    const oauthClient = new OAuth2(clientId, clientSecret, 'https://developers.google.com/oauthplayground')
    oauthClient.setCredentials({
      refresh_token: refreshToken
    })
    console.error(refreshToken)
    return await new Promise((resolve, reject) => {
      oauthClient.getAccessToken((err, token) => {
        if (err) {
          reject(new Error(err.message))
        }
        resolve({ accessToken: token as string })
      })
    })
  }
}

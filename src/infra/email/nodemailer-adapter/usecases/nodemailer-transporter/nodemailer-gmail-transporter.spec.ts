import { GetOauthAccessToken } from '../../protocols/get-oauth-access-token'
import { GmailData, NodemailerGmailTransporter } from './nodemailer-gmail-transporter'

const makeTransporterPropsStub = (): GmailData => ({
  clientId: 'any_id',
  clientSecret: 'any_key',
  refreshToken: 'any_token'
})
const makeGetAccessTokenStub = (): GetOauthAccessToken => {
  class GetOAuthAccessTokenStub implements GetOauthAccessToken {
    async get (): Promise<{ accessToken: 'any_token' }> {
      return await Promise.resolve({ accessToken: 'any_token' })
    }
  }
  return new GetOAuthAccessTokenStub()
}
interface SutTypes {
  getOAuthAccessTokenStub: GetOauthAccessToken
  sut: NodemailerGmailTransporter
}

const makeSut = (): SutTypes => {
  const getOAuthAccessTokenStub = makeGetAccessTokenStub()
  const sut = new NodemailerGmailTransporter(makeTransporterPropsStub(), getOAuthAccessTokenStub)
  return {
    getOAuthAccessTokenStub,
    sut
  }
}

describe('NodemailerGmailTransporter', () => {
  test('should return throw if  GetOAuthAccessToken fails', async () => {
    const { sut, getOAuthAccessTokenStub } = makeSut()
    jest.spyOn(getOAuthAccessTokenStub, 'get').mockReturnValueOnce(Promise.reject(new Error('')))
    const promise = sut.active('any_email@mail.com')
    await expect(promise).rejects.toThrow()
  })
})

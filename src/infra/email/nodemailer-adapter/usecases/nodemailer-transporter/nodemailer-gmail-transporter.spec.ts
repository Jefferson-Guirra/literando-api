import { GetOauthAccessToken } from '../../protocols/get-oauth-access-token'
import { GmailData, NodemailerGmailTransporter } from './nodemailer-gmail-transporter'
import { MailOptions } from 'nodemailer/lib/sendmail-transport'

const makeResetPasswordMessageStub = (): MailOptions => ({
  from: 'any_service_email@mail.com',
  to: 'any_email@mail.com',
  subject: 'Solicitação de mudança de senha para o usuàrio any_username',
  html: '<div><h2>Literando - Mudança de senha</h2><p>Clique no link a seguir para mudar a senha</p><p >any_url/ResetPassword/any_access_token</p><p>link válido por 60 segundos.</p></div>'
})

const makeTransporterPropsStub = (): GmailData => ({
  clientId: 'any_id',
  clientSecret: 'any_key',
  refreshToken: 'any_token',
  serviceEmail: ' any_email@mail.com'
})
const makeGetAccessTokenStub = (): GetOauthAccessToken => {
  class GetOAuthAccessTokenStub implements GetOauthAccessToken {
    async get (clientId: string, clientSecret: string, refreshToken: string): Promise<{ accessToken: 'any_token' }> {
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
  test('should call getAccessToken with correct values)', async () => {
    const { sut, getOAuthAccessTokenStub } = makeSut()
    const getSpy = jest.spyOn(getOAuthAccessTokenStub, 'get')
    await sut.active(makeResetPasswordMessageStub())
    expect(getSpy).toHaveBeenCalledWith('any_id', 'any_key', 'any_token')
  })

  test('should return throw if  GetOAuthAccessToken fails', async () => {
    const { sut, getOAuthAccessTokenStub } = makeSut()
    jest.spyOn(getOAuthAccessTokenStub, 'get').mockReturnValueOnce(Promise.reject(new Error('')))
    const promise = sut.active(makeResetPasswordMessageStub())
    await expect(promise).rejects.toThrow()
  })
})

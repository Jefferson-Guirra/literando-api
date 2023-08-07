import { GetOauthAccessToken } from '../../protocols/get-oauth-access-token'
import { GmailData, NodemailerGmailTransporter } from './nodemailer-gmail-transporter'
import { MailOptions } from 'nodemailer/lib/sendmail-transport'
import nodemailer from 'nodemailer'
import SMTPConnection from 'nodemailer/lib/smtp-connection'

const sendMailMock = jest.fn()
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockImplementation(() => ({
    sendMail: sendMailMock
  }))
}))

const makeResetPasswordMessageStub = (): MailOptions => ({
  from: 'any_service_email@mail.com',
  to: 'any_email@mail.com',
  subject: 'Solicitação de mudança de senha para o usuàrio any_username',
  html: '<div><h2>Literando - Mudança de senha</h2><p>Clique no link a seguir para mudar a senha</p><p >any_url/ResetPassword/any_access_token</p></div>'
})

const makeTransporterPropsStub = (): GmailData => ({
  clientId: 'any_id',
  clientSecret: 'any_key',
  refreshToken: 'any_token',
  serviceEmail: 'any_email@mail.com'
})
const makeGetAccessTokenStub = (): GetOauthAccessToken => {
  class GetOAuthAccessTokenStub implements GetOauthAccessToken {
    async getToken (clientId: string, clientSecret: string, refreshToken: string): Promise<{ accessToken: string }> {
      return await Promise.resolve({ accessToken: 'any_access_token' })
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
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('should call getAccessToken with correct values)', async () => {
    const { sut, getOAuthAccessTokenStub } = makeSut()
    const getSpy = jest.spyOn(getOAuthAccessTokenStub, 'getToken')
    await sut.active(makeResetPasswordMessageStub())
    expect(getSpy).toHaveBeenCalledWith('any_id', 'any_key', 'any_token')
  })

  test('should return throw if  GetOAuthAccessToken fails', async () => {
    const { sut, getOAuthAccessTokenStub } = makeSut()
    jest.spyOn(getOAuthAccessTokenStub, 'getToken').mockReturnValueOnce(Promise.reject(new Error('')))
    const promise = sut.active(makeResetPasswordMessageStub())
    await expect(promise).rejects.toThrow()
  })
  test('should call createTransporter with correct values', async () => {
    const { sut } = makeSut()
    const authStub: SMTPConnection.AuthenticationTypeOAuth2 = {
      type: 'OAuth2',
      user: 'any_email@mail.com',
      clientId: 'any_id',
      clientSecret: 'any_key',
      refreshToken: 'any_token',
      accessToken: 'any_access_token'
    }
    const createSPy = jest.spyOn(nodemailer, 'createTransport')
    await sut.active(makeResetPasswordMessageStub())
    expect(createSPy).toHaveBeenCalledWith({ service: 'gmail', auth: authStub })
  })
  test('should return throw if createTransporter fails', async () => {
    const { sut } = makeSut()
    jest.spyOn(nodemailer, 'createTransport').mockImplementationOnce(() => { throw new Error('') })
    const promise = sut.active(makeResetPasswordMessageStub())
    await expect(promise).rejects.toThrow()
  })
  test('should call sendMail with correct values', async () => {
    const { sut } = makeSut()
    await sut.active(makeResetPasswordMessageStub())
    expect(sendMailMock).toHaveBeenCalledTimes(1)
    expect(sendMailMock).toHaveBeenCalledWith(makeResetPasswordMessageStub())
  })
  test('should return throw if sendMail fails', async () => {
    const { sut } = makeSut()
    jest.spyOn(nodemailer, 'createTransport').mockReturnValue({
      createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockReturnValue((mailoptions: any, callback: any) => { throw new Error('') })
      })
    } as any)
    const response = sut.active(makeResetPasswordMessageStub())
    await expect(response).rejects.toThrow()
  })
})

import { MailOptions } from 'nodemailer/lib/json-transport'
import { NodemailerAdapter } from './nodemailer-adapter'
import { NodemailerTransporter } from './protocols/nodemailer-transporter'

const makeResetPasswordMessageStub = (): MailOptions => ({
  from: 'any_service_email@mail.com',
  to: 'any_email@mail.com',
  subject: 'Solicitação de mudança de senha para o usuàrio any_username',
  html: '<div><h2>Literando - Mudança de senha</h2><p>Clique no link a seguir para mudar a senha</p><p>any_app_url/ResetPassword/any_token</p><p>link válido por 60 segundos.</p></div>'
})
const makeTransporterStub = (): NodemailerTransporter => {
  class NodemailerTransporterStub implements NodemailerTransporter {
    async active (message: MailOptions): Promise<void> {

    }
  }
  return new NodemailerTransporterStub()
}
interface SutTypes {
  nodemailerTransporterStub: NodemailerTransporter
  sut: NodemailerAdapter
}

const makeSut = (): SutTypes => {
  const nodemailerTransporterStub = makeTransporterStub()
  const sut = new NodemailerAdapter('any_service_email@mail.com', 'any_app_url', nodemailerTransporterStub)
  return {
    nodemailerTransporterStub,
    sut
  }
}

describe('NodemailerAdapter', () => {
  test('should  call nodemailerTransporter with correct message', async () => {
    const { sut, nodemailerTransporterStub } = makeSut()
    const activeSpy = jest.spyOn(nodemailerTransporterStub, 'active')
    await sut.sendResetPasswordEmail('any_email@mail.com', 'any_username', 'any_token')
    expect(activeSpy).toHaveBeenCalledWith(makeResetPasswordMessageStub())
  })

  test('should return throw if nodemailerTransporter fails', async () => {
    const { sut, nodemailerTransporterStub } = makeSut()
    jest.spyOn(nodemailerTransporterStub, 'active').mockReturnValueOnce(Promise.reject(new Error('')))
    const promise = sut.sendResetPasswordEmail('any_email@mail.com', 'any_username', 'any_email@mail.com')
    await expect(promise).rejects.toThrow()
  })
})

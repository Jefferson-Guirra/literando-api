import { NodemailerAdapter } from './nodemailer-adapter'
import { NodemailerTransporter } from './protocols/nodemailer-transporter'

const makeTransporterStub = (): NodemailerTransporter => {
  class NodemailerTransporterStub implements NodemailerTransporter {
    async active (message: string): Promise<void> {

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
  const sut = new NodemailerAdapter(nodemailerTransporterStub)
  return {
    nodemailerTransporterStub,
    sut
  }
}

describe('NodemailerAdapter', () => {
  test('should  call nodemailerTRansporter with correct message', async () => {
    const { sut, nodemailerTransporterStub } = makeSut()
    const activeSpy = jest.spyOn(nodemailerTransporterStub, 'active')
    await sut.sendResetPasswordEmail('any_email@mail.com', 'any_username', 'any_token')
    expect(activeSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return throw if nodemailerTransporter fails', async () => {
    const { sut, nodemailerTransporterStub } = makeSut()
    jest.spyOn(nodemailerTransporterStub, 'active').mockReturnValueOnce(Promise.reject(new Error('')))
    const promise = sut.sendResetPasswordEmail('any_email@mail.com', 'any_username', 'any_email@mail.com')
    await expect(promise).rejects.toThrow()
  })
})

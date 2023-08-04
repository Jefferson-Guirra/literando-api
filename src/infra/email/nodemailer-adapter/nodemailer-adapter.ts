import { SendResetPasswordMessage } from '../../../data/protocols/email/send-reset-password-message'
import { NodemailerTransporter } from './protocols/nodemailer-transporter'
import { GenerateEmailMessage } from './helpers/generate-nodmailer-email-message'

export class NodemailerAdapter implements SendResetPasswordMessage {
  constructor (
    private readonly serviceEmail: string,
    private readonly appUrl: string,
    private readonly transporterEmail: NodemailerTransporter
  ) {}

  async sendResetPasswordEmail (email: string, username: string, accessToken: string): Promise<void> {
    const message = GenerateEmailMessage.generateResetPasswordMessage(
      this.serviceEmail,
      email,
      username,
      this.appUrl,
      accessToken
    )
    await this.transporterEmail.active(message)
  }
}

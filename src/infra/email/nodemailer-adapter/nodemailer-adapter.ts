import { SendResetPasswordMessage } from '../../../data/protocols/email/send-reset-password-message'
import { NodemailerTransporter } from './protocols/nodemailer-transporter'

export class NodemailerAdapter implements SendResetPasswordMessage {
  constructor (
    private readonly transporterEmail: NodemailerTransporter
  ) {}

  async sendResetPasswordEmail (email: string, username: string, accessToken: string): Promise<void> {
    await this.transporterEmail.active(email)
  }
}

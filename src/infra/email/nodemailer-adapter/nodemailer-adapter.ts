import { SendMessage } from '../../../data/protocols/email/send-message'
import { NodemailerTransporter } from './protocols/nodemailer-transporter'

export class NodemailerAdapter implements SendMessage {
  constructor (private readonly transporterEMail: NodemailerTransporter) {}
  async sendResetPasswordEmail (email: string, accessToken: string): Promise<void> {
    await this.transporterEMail.active(email)
  }
}

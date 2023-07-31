import { SendMessage } from '../../../data/protocols/email/send-message'
import { NodemailerTransporter } from './protocols/nodemailer-transporter'

export class NodemailerAdapter implements SendMessage {
  constructor (private readonly transporterEMail: NodemailerTransporter) {}
  async sendEmail (email: string): Promise<void> {
    await this.transporterEMail.active(email)
  }
}

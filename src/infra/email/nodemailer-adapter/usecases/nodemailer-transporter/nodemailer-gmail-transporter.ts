import { GetOauthAccessToken } from '../../protocols/get-oauth-access-token'
import { NodemailerTransporter } from '../../protocols/nodemailer-transporter'
import { MailOptions } from 'nodemailer/lib/sendmail-transport'

export interface GmailData {
  clientId: string
  serviceEmail: string
  clientSecret: string
  refreshToken: string
}

export class NodemailerGmailTransporter implements NodemailerTransporter {
  constructor (private readonly gmail: GmailData, private readonly getAccessToken: GetOauthAccessToken) {}
  async active (message: MailOptions): Promise<void> {
    await this.getAccessToken.get(this.gmail.clientId, this.gmail.clientSecret, this.gmail.refreshToken)
  }
}

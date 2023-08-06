import SMTPConnection from 'nodemailer/lib/smtp-connection'
import { GetOauthAccessToken } from '../../protocols/get-oauth-access-token'
import { NodemailerTransporter } from '../../protocols/nodemailer-transporter'
import nodemailer from 'nodemailer'
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
    const { accessToken } = await this.getAccessToken.get(this.gmail.clientId, this.gmail.clientSecret, this.gmail.refreshToken)
    const auth: SMTPConnection.AuthenticationTypeOAuth2 = {
      type: 'OAuth2',
      user: this.gmail.serviceEmail,
      clientId: this.gmail.clientId,
      clientSecret: this.gmail.clientSecret,
      refreshToken: this.gmail.refreshToken,
      accessToken
    }
    nodemailer.createTransport({
      service: 'gmail',
      auth
    })
  }
}

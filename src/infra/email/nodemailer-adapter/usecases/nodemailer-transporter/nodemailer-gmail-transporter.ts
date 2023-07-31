import { GetOauthAccessToken } from '../../protocols/get-oauth-access-token'
import { NodemailerTransporter } from '../../protocols/nodemailer-transporter'

export interface GmailData {
  clientId: string
  clientSecret: string
  refreshToken: string

}

export class NodemailerGmailTransporter implements NodemailerTransporter {
  constructor (private readonly gmail: GmailData, private readonly getAccessToken: GetOauthAccessToken) {}
  async active (email: string): Promise<void> {
    await this.getAccessToken.get()
  }
}

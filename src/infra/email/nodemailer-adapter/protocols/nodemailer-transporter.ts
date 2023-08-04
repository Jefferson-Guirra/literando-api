import { MailOptions } from 'nodemailer/lib/sendmail-transport'

export interface NodemailerTransporter {
  active: (message: MailOptions) => Promise<void>
}

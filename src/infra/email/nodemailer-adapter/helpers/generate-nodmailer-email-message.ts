import { MailOptions } from 'nodemailer/lib/json-transport'

export const GenerateEmailMessage = {
  generateResetPasswordMessage (serviceEmail: string, userEmail: string, username: string, url: string, accessToken: string): MailOptions {
    const redirectUrl = `${url}/ResetPassword/${accessToken}`.toString()
    return {
      from: serviceEmail,
      to: userEmail,
      subject: `Solicitação de mudança de senha para o usuàrio ${username}`,
      html: `<div><h2>Literando - Mudança de senha</h2><p>Clique no link a seguir para mudar a senha</p><p>${redirectUrl}</p></div>`
    }
  }
}

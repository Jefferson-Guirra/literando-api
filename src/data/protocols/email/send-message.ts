export interface SendMessage {
  sendResetPasswordEmail: (email: string, accessToken: string) => Promise<void>
}

export interface SendResetPasswordMessage {
  sendResetPasswordEmail: (email: string, accessToken: string) => Promise<void>
}

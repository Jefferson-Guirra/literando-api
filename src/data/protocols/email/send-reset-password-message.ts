export interface SendResetPasswordMessage {
  sendResetPasswordEmail: (email: string, username: string, accessToken: string) => Promise<void>
}

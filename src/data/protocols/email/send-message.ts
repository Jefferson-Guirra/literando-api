export interface SendMessage {
  sendEmail: (email: string, accessToken: string) => Promise<void>
}

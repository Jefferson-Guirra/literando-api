export interface SendMessage {
  sendEmail: (email: string) => Promise<void>
}

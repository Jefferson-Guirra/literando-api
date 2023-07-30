export interface Message {
  ok: boolean
  message: string
}

export interface SendMessage {
  sendEmail: (email: string) => Promise<Message>
}

export interface ResetPasswordEmail {
  reset: (email: string) => Promise<{ email: string, success: boolean }>
}

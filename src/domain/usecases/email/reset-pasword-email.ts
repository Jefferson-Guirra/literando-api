export interface ResetPasswordEmailModel {
  id: string
  email: string
  accessToken: string
}
export interface ResetPasswordEmail {
  reset: (email: string) => Promise< ResetPasswordEmailModel | null>
}

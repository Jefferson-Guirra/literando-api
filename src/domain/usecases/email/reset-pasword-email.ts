export interface ResetPasswordEmailModel {
  email: string
  id: string
}
export interface ResetPasswordEmail {
  reset: (email: string) => Promise< ResetPasswordEmailModel | null>
}

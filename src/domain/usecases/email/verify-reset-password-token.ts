export interface VerifyResetPasswordToken {
  verifyResetPasswordToken: (accessToken: string) => Promise<boolean>
}

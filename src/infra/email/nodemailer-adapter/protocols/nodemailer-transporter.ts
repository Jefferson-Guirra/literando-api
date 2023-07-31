export interface NodemailerTransporter {
  active: (email: string) => Promise<void>
}

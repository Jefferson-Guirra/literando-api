export interface DeleteAllBuyBookList {
  deleteAllBooks: (accessToken: string) => Promise<void | null>
}

export interface DeleteAllBuyBooksListRepository {
  deleteAllBooks: (userId: string) => Promise<void>
}

import { DbGetBookList } from '../../../../data/usecases/book-list/get-book-list/db-get-book-list'
import { AccountMongoRepository } from '../../../../infra/db/account/account-mongo-repository'
import { BookListMongoRepository } from '../../../../infra/db/book-list/book-list-mongo-repository'
import { GetBookListController } from '../../../../presentation/controllers/book-list/get-book-list/get-book-list-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { makeGetBookValidator } from './get-book-list-validator-factory'

export const makeGetBookListController = (): Controller => {
  const validator = makeGetBookValidator()
  const accountMongoRepository = new AccountMongoRepository()
  const bookListMongoRepository = new BookListMongoRepository()
  const dbGetBookList = new DbGetBookList(
    accountMongoRepository,
    bookListMongoRepository
  )
  return new GetBookListController(validator, dbGetBookList)
}

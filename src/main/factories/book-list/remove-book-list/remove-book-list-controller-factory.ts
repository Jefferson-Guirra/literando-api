import { DbRemoveBookList } from '../../../../data/usecases/book-list/remove-book-list/db-remove-book-list'
import { AccountMongoRepository } from '../../../../infra/db/account/account-mongo-repository'
import { BookListMongoRepository } from '../../../../infra/db/book-list/book-list-mongo-repository'
import { RemoveBookListController } from '../../../../presentation/controllers/book-list/remove-book-list/remove-book-list-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { makeRemoveBookValidator } from './remove-book-validator-factory'

export const makeRemoveBookListController = (): Controller => {
  const validate = makeRemoveBookValidator()
  const accountMongoRepository = new AccountMongoRepository()
  const bookListMongoRepository = new BookListMongoRepository()
  const dbRemoveBookList = new DbRemoveBookList(
    accountMongoRepository,
    bookListMongoRepository
  )
  return new RemoveBookListController(validate, dbRemoveBookList)
}

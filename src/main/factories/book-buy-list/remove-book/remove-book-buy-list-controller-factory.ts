import { DbDeleteBuyBookList } from '../../../../data/usecases/book-buy-list/delete-book-buy-list/db-delete-buy-book-list'
import { AccountMongoRepository } from '../../../../infra/db/account/account-mongo-repository'
import { BuyBooksListMongoRepository } from '../../../../infra/db/book-buy-list/book-buy-list-mongo-repository'
import { DeleteBuyBookListController } from '../../../../presentation/controllers/book-buy-list/delete-book-buy-list/delete-book-buy-list-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { makeRemoveBookBuyListValidator } from './remove-book-buy-list-validator-factory'

export const makeRemoveBookBuyListController = (): Controller => {
  const validator = makeRemoveBookBuyListValidator()
  const accountMongoRepository = new AccountMongoRepository()
  const buyBooksListMongoRepository = new BuyBooksListMongoRepository()
  const dbDeleteBuyBookList = new DbDeleteBuyBookList(
    accountMongoRepository,
    buyBooksListMongoRepository
  )
  return new DeleteBuyBookListController(validator, dbDeleteBuyBookList)
}

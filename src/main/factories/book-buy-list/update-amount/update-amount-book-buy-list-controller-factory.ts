import { DbUpdateAmountBookBuyList } from '../../../../data/usecases/book-buy-list/update-amount-book-buy-list/db-update-amount-book-buy-list'
import { AccountMongoRepository } from '../../../../infra/db/account/account-mongo-repository'
import { BuyBooksListMongoRepository } from '../../../../infra/db/book-buy-list/book-buy-list-mongo-repository'
import { UpdateAmountBookBuyListController } from '../../../../presentation/controllers/book-buy-list/update-amount-book-buy-list/update-amount-book-buy-list-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { makeUpdateAmountBookBuyListValidator } from './update-amount-book-buy-list-validator-factory'

export const makeUpdateAmountBookBuyListController = (): Controller => {
  const validator = makeUpdateAmountBookBuyListValidator()
  const accountMongoRepository = new AccountMongoRepository()
  const bookBuyListMongoRepository = new BuyBooksListMongoRepository()
  const dbUpdateAmountBookBuyList = new DbUpdateAmountBookBuyList(
    accountMongoRepository,
    bookBuyListMongoRepository,
    bookBuyListMongoRepository
  )
  return new UpdateAmountBookBuyListController(
    validator,
    dbUpdateAmountBookBuyList
  )
}

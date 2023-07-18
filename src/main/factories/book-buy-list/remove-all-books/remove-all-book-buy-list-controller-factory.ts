import { DbDeleteAllBooksBuyList } from '../../../../data/usecases/book-buy-list/delete-all-books-buy-list/db-delete-all-books-buy-list'
import { AccountMongoRepository } from '../../../../infra/db/account/account-mongo-repository'
import { BuyBooksListMongoRepository } from '../../../../infra/db/book-buy-list/book-buy-list-mongo-repository'
import { DeleteAllBuyBooKListController } from '../../../../presentation/controllers/book-buy-list/delete-all-book-buy-list/delete-all-book-buy-list-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator'

export const makeRemoveAllBooksBuyListController = (): Controller => {
  const validator = new RequiredFieldValidator('accessToken')
  const accountMongoRepository = new AccountMongoRepository()
  const buyBooksListMongoRepository = new BuyBooksListMongoRepository()
  const dbDeleteAllBooksBuyList = new DbDeleteAllBooksBuyList(
    accountMongoRepository,
    buyBooksListMongoRepository
  )
  return new DeleteAllBuyBooKListController(validator, dbDeleteAllBooksBuyList)
}

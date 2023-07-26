import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeAddBookBuyListController } from '../factories/book-buy-list/add-book/add-book-buy-list-controller-factory'
import { makeGetBookBuyListController } from '../factories/book-buy-list/get-book/get-book-buy-list-controller-factory'
import { makeRemoveBookBuyListController } from '../factories/book-buy-list/remove-book/remove-book-buy-list-controller-factory'

const buyBookLIst = (route: Router): void => {
  route.post('/add-buy-book', adaptRoute(makeAddBookBuyListController()))
  route.post('/get-buy-book', adaptRoute(makeGetBookBuyListController()))
  route.delete('/remove-buy-book', adaptRoute(makeRemoveBookBuyListController()))
}

export default buyBookLIst

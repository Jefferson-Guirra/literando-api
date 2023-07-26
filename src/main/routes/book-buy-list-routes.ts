import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeAddBookBuyListController } from '../factories/book-buy-list/add-book/add-book-buy-list-controller-factory'

const buyBookLIst = (route: Router): void => {
  route.post('/add-buy-book', adaptRoute(makeAddBookBuyListController()))
}

export default buyBookLIst

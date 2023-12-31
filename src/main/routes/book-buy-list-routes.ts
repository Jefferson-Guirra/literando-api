import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeAddBookBuyListController } from '../factories/book-buy-list/add-book/add-book-buy-list-controller-factory'
import { makeGetBookBuyListController } from '../factories/book-buy-list/get-book/get-book-buy-list-controller-factory'
import { makeRemoveBookBuyListController } from '../factories/book-buy-list/remove-book/remove-book-buy-list-controller-factory'
import { makeUpdateAmountBookBuyListController } from '../factories/book-buy-list/update-amount/update-amount-book-buy-list-controller-factory'
import { makeGetBuyBooksListController } from '../factories/book-buy-list/get-books/get-books-buy-list-factory'

const buyBookLIst = (route: Router): void => {
  route.post('/add-buy-book', adaptRoute(makeAddBookBuyListController()))
  route.post('/get-buy-book', adaptRoute(makeGetBookBuyListController()))
  route.delete('/remove-buy-book', adaptRoute(makeRemoveBookBuyListController()))
  route.put('/update-amount-buy-book', adaptRoute(makeUpdateAmountBookBuyListController()))
  route.post('/get-buy-books', adaptRoute(makeGetBuyBooksListController()))
}

export default buyBookLIst

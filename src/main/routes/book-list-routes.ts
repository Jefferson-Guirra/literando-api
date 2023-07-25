import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeAddBookListController } from '../factories/book-list/add-book-list/add-book-list-factory'
import { makeGetBookListController } from '../factories/book-list/get-book-list/get-book-list-controller-factory'

const bookListRoute = (router: Router): void => {
  router.post('/add-book', adaptRoute(makeAddBookListController()))
  router.post('/get-book', adaptRoute(makeGetBookListController()))
}

export default bookListRoute

import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeAddBookListController } from '../factories/book-list/add-book-list/add-book-list-factory'

const bookListRoute = (router: Router): void => {
  router.post('/add-book', adaptRoute(makeAddBookListController()))
}

export default bookListRoute

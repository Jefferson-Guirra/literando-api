import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeAddBookListController } from '../factories/book-list/add-book-list/add-book-list-factory'
import { makeGetBookListController } from '../factories/book-list/get-book-list/get-book-list-controller-factory'
import { makeRemoveBookListController } from '../factories/book-list/remove-book-list/remove-book-list-controller-factory'
import { makeGetBooksListController } from '../factories/book-list/get-books-list/get-books-list-controller-factory'

const bookListRoute = (router: Router): void => {
  router.post('/add-book', adaptRoute(makeAddBookListController()))
  router.post('/get-book', adaptRoute(makeGetBookListController()))
  router.delete('/remove-book', adaptRoute(makeRemoveBookListController()))
  router.post('/get-books', adaptRoute(makeGetBooksListController()))
}

export default bookListRoute

import { Router } from 'express'

const accountRouter = (router: Router): void => {
  router.post('/signup', (req, res) => res.json({ name: 'test' }))
}
export default accountRouter

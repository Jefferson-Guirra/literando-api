import app from '../config/app'
import request from 'supertest'

describe('bodyParser', () => {
  test('should parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })
    await request(app).post('/test_body_parser').send({ name: 'jefferson' }).expect({ name: 'jefferson' })
  })
})

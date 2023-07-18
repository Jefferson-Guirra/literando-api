import request from 'supertest'
import app from '../config/app'

describe('Account routes', () => {
  test('should return a account on success', async () => {
    await request(app).post('/api/signup').send({
      username: 'jefferson',
      email: 'jeffersontest_jest@gmail.com',
      password: '123456',
      passwordConfirmation: '123456'
    }).expect(200)
  })
})

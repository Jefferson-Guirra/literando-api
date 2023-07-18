import * as dotenv from 'dotenv'
dotenv.config()
export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/literando',
  port: process.env.port || 8080,
  jwtSecret: process.env.JWT_SECRET || 'rjlkm856LjCvAe158WKl-=ER=Kmnw/'
}

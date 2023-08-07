import * as dotenv from 'dotenv'
dotenv.config()
export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/literando',
  port: process.env.port || 8080,
  jwtSecret: process.env.JWT_SECRET || 'rjlkm856LjCvAe158WKl-=ER=Kmnw/',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleSecret: process.env.GOOGLE_SECRET,
  googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN
}

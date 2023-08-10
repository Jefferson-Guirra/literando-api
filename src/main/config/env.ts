import * as dotenv from 'dotenv'
dotenv.config()
export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/literando',
  port: process.env.port || 8080,
  jwtSecret: process.env.JWT_SECRET || 'rjlkm856LjCvAe158WKl-=ER=Kmnw/',
  serverUrl: process.env.SERVER_URL || 'http://localhost:8080',
  serviceEmail: process.env.SERVICE_EMAIL as string,
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleSecret: process.env.GOOGLE_SECRET,
  googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN
}

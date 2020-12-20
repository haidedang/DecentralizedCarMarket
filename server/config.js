const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/crypto-drive',
  port: process.env.PORT || 8000,
  debug: true,
}

export default config

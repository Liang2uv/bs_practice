const env = process.env.NODE_ENV

let MONGO_CONF = {
  host: '127.0.0.1',
  user: null,
  password: null,
  port: '27017',
  database: 'bs-practice'
}

if (env === 'dev') {
  MONGO_CONF = {
    host: '127.0.0.1',
    user: null,
    password: null,
    port: '27017',
    database: 'bs-practice'
  }
}

if (env === 'production') {
  MONGO_CONF = {
    host: '127.0.0.1',
    user: null,
    password: null,
    port: '3306',
    database: 'bs-practice'
  }
}

module.exports = {
  MONGO_CONF
}
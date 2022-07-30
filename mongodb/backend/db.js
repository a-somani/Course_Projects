const mongodb = require("mongodb")
const MongoClient = mongodb.MongoClient
const Decimal128 = mongodb.Decimal128
const mongoDbUrl =
  "mongodb+srv://frontend-client:react-app@practicecluster0.3joea.mongodb.net/shopDB?retryWrites=true&w=majority"

let _db

const initDb = (callback) => {
  if (_db) {
    console.log("db is already initialized")
    return callback(null, _db)
  }
  MongoClient.connect(mongoDbUrl)
    .then((client) => {
      _db = client
      callback(null, _db)
    })
    .catch((err) => {
      callback(err)
    })
}

const getDb = () => {
  if (!_db) throw Error("db not initialized")
  return _db
}

module.exports = {
  initDb,
  getDb,
}

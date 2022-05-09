const MongoClient = require('mongodb').MongoClient;
const settings = {
  "mongoConfig": {
    "serverUrl": "mongodb://localhost:27017/",
    "database": "DuckBook"
  }
};

const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

module.exports = {
  dbConnection: async () => {
    if (!_connection) {
      _connection = await MongoClient.connect(mongoConfig.serverUrl);
      _db = await _connection.db(mongoConfig.database);
    }

    return _db;
  },
  closeConnection: async () => {
    _connection.close();
  }
};
const mysql = require("mysql")

exports.getConnection = function() {
  return mysql.createConnection({
    host: "34.93.83.72",
    user: "root",
    password: "root",
    database: "crypto_world"
  })
}

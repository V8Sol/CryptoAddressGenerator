const bitcoin = require('./bitcoin')
const mysql = require("../db/mysql")
const slack = require('../notification/slack')

const connection = mysql.getConnection()
connection.connect(function (err) {
  if (err) throw err;
  slack.alert("Bitcoin address generation started!");

  const run = async () => {
    while (true) {
      try {
        const keyPair = bitcoin.getKeyPair();
        const balance = await bitcoin.getBalance(keyPair.getAddress())
        if (balance > 0) {
          slack.notify("Bitcoin", keyPair.getAddress(), keyPair.toWIF(), balance)
        }
        let sql = `INSERT INTO address (coin, address, secret, balance) VALUES ('BTC', '${keyPair.getAddress()}', '${keyPair.toWIF()}', '${balance}')`;
        connection.query(sql, function (err, result) {
          if (err) throw err;
        });
      } catch (e) {
        console.log(e)
      }
    }
  }
  run()
});

const eth = require('./ether')
const mysql = require("../db/mysql")
const slack = require('../notification/slack')

const connection = mysql.getConnection()
connection.connect(function (err) {
  if (err) throw err;
  slack.alert("Ethereum address generation started!");

  const run = async () => {
    while (true) {
      try {
        const keyPair = eth.getKeyPair();
        const balance = await eth.getBalance(keyPair.address)
        if (balance > 0) {
          slack.notify("Ethereum", keyPair.address, keyPair.privateKey, balance)
        }
        let sql = `INSERT INTO address (coin, address, secret, balance) VALUES ('ETH', '${keyPair.address}', '${keyPair.privateKey}', '${balance}')`;
        connection.query(sql, function (err, result) {
          if (err) throw err;
        });
      } catch (e) {
        console.log(e)
      }
    }
  }
  run()
})
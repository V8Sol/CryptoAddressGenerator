const axios = require("axios");
const web3 = require("web3");
const mysql = require("mysql")

const con = mysql.createConnection({
  host: "34.93.83.72",
  user: "root",
  password: "root",
  database: "crypto_world"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  const getBalance = async address => {
    try {
      const body = {
        id: 1,
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [`${address}`, "latest"]
      }
      const url = `https://mainnet.infura.io/v3/f221ad528a584387950f61e9d0baebbb`
      const response = await axios.post(url, body);
      return Promise.resolve(response.data.result != '0x0' ? 1 : 0)
    } catch (error) {
      console.log(error);
      return Promise.resolve(0);
    }
  };

  const run = async () => {

    while (true) {
      const eth = new web3().eth.accounts.create();
      const balance = await getBalance(eth.address)
      if (balance > 0) {
        axios.post('https://hooks.slack.com/services/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', {
          "text": `Found Ether address ${eth.address} with balance ${balance}`
        }).then(function (response) {
          console.log(response);
        }).catch(function (error) {
          console.log(error);
        });
      }
      let sql = `INSERT INTO address (coin, address, secret, balance) VALUES ('ETH', '${eth.address}', '${eth.privateKey}', '${balance}')`;
      con.query(sql, function (err, result) {
        if (err) throw err;
      });
    }
  }
  run()
});

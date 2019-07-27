const axios = require("axios");
const mysql = require("mysql")
const util = require('util');

const con = mysql.createConnection({
  host: "crypto-scanner.ca2iecww9r6d.ap-south-1.rds.amazonaws.com",
  user: "trading_bot",
  password: "Rspl123#",
  database: "crypto_world"
});

const query = util.promisify(con.query).bind(con);

const getTransactions = async () => {
  try {
    const url = `https://api.blockcypher.com/v1/btc/main/txs`
    const response = await axios.get(url);
    return Promise.resolve(response.data)
  } catch (error) {
    return Promise.resolve(0);
  }
};

const isAddressExist = async (address) => {
  let sql = `select * from address where address = '${address}'`
  let isRecordExist = await query(sql)
  return isRecordExist.length > 0;
};

const notifyOnSlack = async address => {
  console.log(`Found Bitcoin address ${address} in database`)
  axios.post('https://hooks.slack.com/services/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', {
    "text": `Found Bitcoin address ${address} in database`
  }).then(function (response) {
    console.log(response);
  }).catch(function (error) {
    console.log(error);
  });
};

const run = async () => {
  while (true) {
    const transactions = await getTransactions();
    for(i in transactions) {
      const inputs = transactions[i].inputs
      for (j in inputs) {
        const addresses = inputs[j].addresses
        for(k in addresses) {
          const address = addresses[k]
          const isExist = await isAddressExist(address);
          if(isExist) {
            notifyOnSlack(address)
          }
        }
      }
    }
  }
}
run()

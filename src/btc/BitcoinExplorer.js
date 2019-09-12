const axios = require("axios");
const mysql = require("db/mysql")
const util = require('util');

const con = mysql.getConnection()

const query = util.promisify(con.query).bind(con);

const getLatestBlock = async () => {
  const url = `https://blockchain.info/latestblock`
  const response = await axios.get(url);
  return Promise.resolve(response.data)
}

const getTransactions = async () => {
  const blockNumber = await getLatestBlock()
  const url = `https://blockchain.info/rawblock/${blockNumber}`
  const response = await axios.get(url);
  return Promise.resolve(response.data)
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
    try {
      const transactions = await getTransactions();
      for (i in transactions) {
        const inputs = transactions[i].inputs
        for (j in inputs) {
          const addresses = inputs[j].addresses
          for (k in addresses) {
            const address = addresses[k]
            const isExist = await isAddressExist(address);
            if (isExist) {
              notifyOnSlack(address)
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
run()

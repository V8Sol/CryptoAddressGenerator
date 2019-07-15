const bitcoin = require("bitcoinjs-lib")
const axios = require("axios");

const getBalance = async address => {
  try {
    const url = `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`
    const response = await axios.get(url);
    const balance = parseFloat(response.data.balance + response.data.total_received)
    return Promise.resolve(balance)
  } catch (error) {
    return Promise.resolve(0);
  }
};

const run = async () => {

  while (true) {
    const keyPair = bitcoin.ECPair.makeRandom();
    const balance = await getBalance(keyPair.getAddress())
    if (balance > 0) {
      axios.post('https://hooks.slack.com/services/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', {
        "text": `Found Bitcoin address ${keyPair.getAddress()} with balance ${balance}`
      }).then(function (response) {
        console.log(response);
      }).catch(function (error) {
        console.log(error);
      });
    }
  }
}
run()

const bitcoin = require("bitcoinjs-lib")
const axios = require("axios");

const getBalance = async address => {
  try {
    const url = `https://blockchain.info/q/addressbalance/${address}`
    const response = await axios.get(url);
    return Promise.resolve(response.data / 100000000)
  } catch (error) {
    console.log(error);
    return Promise.resolve(0);
  }
};

const run = async () => {

  while (true) {
    const keyPair = bitcoin.ECPair.makeRandom();
    const balance = await getBalance(keyPair.getAddress())
    if (balance > 0) {
      axios.post('https://hooks.slack.com/services/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', {
        "text": `Found Bitcoin address ${keyPair.getAddress()}, Key: ${keyPair.toWIF()} with balance ${balance}`
      }).then(function (response) {
        console.log(response);
      }).catch(function (error) {
        console.log(error);
      });
    }
  }
}
run()

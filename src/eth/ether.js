const web3 = require("web3");
const axios = require("axios");

exports.getBalance = async address => {
  //api key: NVDGQFJ7FXPYK1MQ6D586F6FZ6JRFM2ZGI
  const url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=YourApiKeyToken`
  const response = await axios.get(url);
  return Promise.resolve(response.data.result)
}

exports.getKeyPair = () => {
  return new web3().eth.accounts.create()
}


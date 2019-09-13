const web3 = require("web3");
const axios = require("axios");

exports.getBalance = async address => {
  const body = {
    id: 1,
    jsonrpc: "2.0",
    method: "eth_getBalance",
    params: [`${address}`, "latest"]
  }
  const url = `https://mainnet.infura.io/v3/f221ad528a584387950f61e9d0baebbb`
  const response = await axios.post(url, body);
  return Promise.resolve(response.data.result != '0x0' ? 1 : 0)
}

exports.getKeyPair = () => {
  return new web3().eth.accounts.create()
}


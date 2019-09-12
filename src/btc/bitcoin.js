const axios = require("axios");
const bitcoin = require("bitcoinjs-lib")

exports.getBalance = async address => {
  const url = `https://blockchain.info/q/addressbalance/${address}`
  const response = await axios.get(url);
  return Promise.resolve(response.data / 100000000)
}

exports.getLatestBlock = async () => {
  const url = `https://blockchain.info/latestblock`
  const response = await axios.get(url);
  return Promise.resolve(response.data.block_index)
}

exports.getTransactions = async () => {
  const blockNumber = await this.getLatestBlock()
  const url = `https://blockchain.info/rawblock/${blockNumber}`
  const response = await axios.get(url);
  return Promise.resolve(response.data.tx)
}

exports.getKeyPair = () => {
  return bitcoin.ECPair.makeRandom()
}


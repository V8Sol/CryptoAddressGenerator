const eth = require('./ether')
const slack = require('../notification/slack')

const run = async () => {
  slack.alert("Ethereum address finder started!");
  while (true) {
    try {
      const keyPair = eth.getKeyPair();
      const balance = await eth.getBalance(keyPair.address)
      if (balance > 0) {
        slack.notify("Ethereum", keyPair.address, keyPair.privateKey, balance)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
run()

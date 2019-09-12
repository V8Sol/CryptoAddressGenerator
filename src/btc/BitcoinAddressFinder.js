const bitcoin = require('./bitcoin')
const slack = require('../notification/slack')

const run = async () => {
  while (true) {
    try {
      const keyPair = bitcoin.getKeyPair();
      const balance = await bitcoin.getBalance(keyPair.getAddress())
      if (balance > 0) {
        slack.notify("Bitcoin", keyPair.getAddress(), keyPair.toWIF(), balance)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
run()

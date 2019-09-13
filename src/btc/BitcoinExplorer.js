const mysql = require("../db/mysql")
const util = require('util');
const bitcoin = require('./bitcoin')
const slack = require('../notification/slack')

const con = mysql.getConnection()

const query = util.promisify(con.query).bind(con);

const isAddressExist = async (address) => {
  let sql = `select * from address where address = '${address}'`
  let isRecordExist = await query(sql)
  return isRecordExist.length > 0;
};

function sleep(ms){
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
}

const run = async () => {
  slack.alert("Bitcoin Explorer Started searching for address...")
  var lastBlockNumber = 0
  while (true) {
    try {
      const blockNumber = await bitcoin.getLatestBlock()
      if (lastBlockNumber != blockNumber) {
        const transactions = await bitcoin.getTransactions(blockNumber)
        for (t in transactions) {
          const txn = transactions[t]
          const inputs = txn.inputs
          const outputs = txn.out
          for(i in inputs) {
            if(inputs[i].addr && inputs[i].addr.startsWith("1")) {
              const isExist = await isAddressExist(inputs[i].addr)
              if(isExist) {
                slack.notify("Bitcoin", inputs[i].addr, "******", "******")
              }
            }
          }

          for(o in outputs) {
            if(outputs[0].addr && outputs[0].addr.startsWith("1")) {
              const isExist = await isAddressExist(outputs[0].addr)
              if(isExist) {
                slack.notify("Bitcoin", outputs[0].addr, "******", "******")
              }
            }
          }
        }
        lastBlockNumber = blockNumber
      } else {
        await sleep(10000)
      }
    } catch (error) {
      console.log(error);
    }
  }
}
run()
